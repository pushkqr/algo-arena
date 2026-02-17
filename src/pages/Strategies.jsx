import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import PageShell from "../components/PageShell";
import { strategiesApi } from "../api/strategiesApi";
import { ApiClientError } from "../lib/apiClient";
import { ROUTES } from "../lib/routes";

const DEFAULT_ENV = "AuctionHouse";
const ENV_OPTIONS = ["AuctionHouse"];

const ACTIVE_FILTERS = [
  { value: "all", label: "All" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

function normalizeStrategiesResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.strategies)) {
    return payload.strategies;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function Strategies() {
  const navigate = useNavigate();
  const [envName, setEnvName] = useState(DEFAULT_ENV);
  const [activeFilter, setActiveFilter] = useState("all");
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activatingId, setActivatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const activeQueryParam = useMemo(() => {
    if (activeFilter === "true") {
      return "true";
    }
    if (activeFilter === "false") {
      return "false";
    }
    return undefined;
  }, [activeFilter]);

  const fetchStrategies = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const payload = await strategiesApi.list({
        envName,
        active: activeQueryParam,
      });
      setStrategies(normalizeStrategiesResponse(payload));
    } catch (apiError) {
      if (apiError instanceof ApiClientError && apiError.status === 401) {
        navigate(ROUTES.login, { replace: true });
        return;
      }

      if (apiError instanceof ApiClientError && apiError.status === 403) {
        setError("You are not allowed to access strategies for this account.");
      } else {
        setError(apiError?.message || "Failed to load strategies.");
      }
    } finally {
      setLoading(false);
    }
  }, [activeQueryParam, envName, navigate]);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  async function handleSetActive(strategyId) {
    setActivatingId(strategyId);
    setError("");

    try {
      await strategiesApi.setActive(strategyId, envName);
      await fetchStrategies();
    } catch (apiError) {
      if (apiError instanceof ApiClientError && apiError.status === 401) {
        navigate(ROUTES.login, { replace: true });
        return;
      }

      setError(apiError?.message || "Failed to set active strategy.");
    } finally {
      setActivatingId("");
    }
  }

  async function handleDelete(strategyId, strategyName) {
    const hasConfirmed = window.confirm(
      `Delete strategy \"${strategyName || "Unnamed strategy"}\"?`,
    );

    if (!hasConfirmed) {
      return;
    }

    setDeletingId(strategyId);
    setError("");

    try {
      await strategiesApi.remove(strategyId);
      await fetchStrategies();
    } catch (apiError) {
      if (apiError instanceof ApiClientError && apiError.status === 401) {
        navigate(ROUTES.login, { replace: true });
        return;
      }

      setError(apiError?.message || "Failed to delete strategy.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <PageShell
      title="Strategies"
      subtitle="List, create, edit, delete, and set your active strategy per environment."
    >
      <div className="toolbar-row">
        <div className="toolbar-item">
          <label htmlFor="envName">Environment</label>
          <select
            id="envName"
            value={envName}
            onChange={(event) => setEnvName(event.target.value)}
          >
            {ENV_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="toolbar-item">
          <label htmlFor="activeFilter">Status</label>
          <select
            id="activeFilter"
            value={activeFilter}
            onChange={(event) => setActiveFilter(event.target.value)}
          >
            {ACTIVE_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="secondary-btn"
          onClick={fetchStrategies}
          disabled={loading}
        >
          Refresh
        </button>

        <button
          className="secondary-btn"
          onClick={() => navigate(ROUTES.app.newStrategy)}
        >
          New Strategy
        </button>
      </div>

      {error ? (
        <ErrorState
          title="Unable to load strategies"
          message={error}
          actionLabel="Try Again"
          onAction={fetchStrategies}
          compact
        />
      ) : null}

      {loading ? (
        <LoadingState message="Loading strategies..." compact />
      ) : strategies.length === 0 ? (
        <EmptyState
          title="No strategies found"
          message="No strategies match this filter. Try changing environment or status."
          compact
        />
      ) : (
        <div className="table-wrap">
          <table className="strategy-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Environment</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((strategy) => {
                const strategyId = strategy.strategyId || strategy._id || "";
                const updatedAt =
                  strategy.updatedAt || strategy.createdAt || "-";

                return (
                  <tr key={strategyId || strategy.name}>
                    <td>{strategy.name || "Unnamed strategy"}</td>
                    <td>{strategy.envName || envName}</td>
                    <td>
                      {strategy.isActive ? (
                        <span className="status-badge active">Active</span>
                      ) : (
                        <span className="status-badge">Inactive</span>
                      )}
                    </td>
                    <td>{updatedAt}</td>
                    <td>
                      <div className="action-row">
                        <button
                          className="secondary-btn"
                          disabled={
                            Boolean(strategy.isActive) ||
                            activatingId === strategyId ||
                            !strategyId
                          }
                          onClick={() => handleSetActive(strategyId)}
                        >
                          {activatingId === strategyId
                            ? "Setting..."
                            : "Set Active"}
                        </button>

                        <button
                          className="secondary-btn"
                          disabled={!strategyId}
                          onClick={() =>
                            navigate(ROUTES.app.strategyById(strategyId))
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="secondary-btn danger"
                          disabled={deletingId === strategyId || !strategyId}
                          onClick={() =>
                            handleDelete(strategyId, strategy.name)
                          }
                        >
                          {deletingId === strategyId ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}

export default Strategies;
