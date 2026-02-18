import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import PageShell from "../components/PageShell";
import { resultsApi } from "../api/resultsApi";
import { ApiClientError } from "../lib/apiClient";
import { ROUTES } from "../lib/routes";

const RECENT_LIMIT = 25;
const ENV_FILTERS = [
  { value: "all", label: "All Environments" },
  { value: "AuctionHouse", label: "AuctionHouse" },
];

function normalizeResultsResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function sortByMostRecent(rows) {
  return [...rows].sort((left, right) => {
    const leftTs = Date.parse(
      left?.updatedAt || left?.createdAt || left?.timestamp || "",
    );
    const rightTs = Date.parse(
      right?.updatedAt || right?.createdAt || right?.timestamp || "",
    );

    if (Number.isNaN(leftTs) && Number.isNaN(rightTs)) {
      return 0;
    }
    if (Number.isNaN(leftTs)) {
      return 1;
    }
    if (Number.isNaN(rightTs)) {
      return -1;
    }

    return rightTs - leftTs;
  });
}

function MyResults() {
  const navigate = useNavigate();
  const [evaluationIdInput, setEvaluationIdInput] = useState("");
  const [envFilter, setEnvFilter] = useState("all");
  const [selectedEvaluationId, setSelectedEvaluationId] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prefillUnavailable, setPrefillUnavailable] = useState(false);

  const selectedEnvName = useMemo(
    () => (envFilter === "all" ? undefined : envFilter),
    [envFilter],
  );

  const showingEvaluationResults = useMemo(
    () => Boolean(selectedEvaluationId),
    [selectedEvaluationId],
  );

  useEffect(() => {
    let active = true;

    async function loadRecentResults() {
      setLoading(true);
      setError("");

      try {
        const payload = await resultsApi.listMine({
          envName: selectedEnvName,
          limit: RECENT_LIMIT,
        });
        if (!active) {
          return;
        }

        const normalized = normalizeResultsResponse(payload);
        setResults(sortByMostRecent(normalized));
        setSelectedEvaluationId("");
        setPrefillUnavailable(false);
      } catch (apiError) {
        if (!active) {
          return;
        }

        if (apiError instanceof ApiClientError && apiError.status === 401) {
          navigate(ROUTES.login, { replace: true });
          return;
        }

        if (
          apiError instanceof ApiClientError &&
          [403, 404, 405].includes(apiError.status)
        ) {
          setResults([]);
          setSelectedEvaluationId("");
          setPrefillUnavailable(true);
          return;
        }

        setError(apiError?.message || "Failed to load recent results.");
        setResults([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRecentResults();

    return () => {
      active = false;
    };
  }, [navigate, selectedEnvName]);

  async function handleLoadResults() {
    const trimmedEvaluationId = evaluationIdInput.trim();
    if (!trimmedEvaluationId) {
      setError("Evaluation ID is required.");
      return;
    }

    setLoading(true);
    setError("");
    setPrefillUnavailable(false);

    try {
      const payload = await resultsApi.listByEvaluation(trimmedEvaluationId);
      setResults(normalizeResultsResponse(payload));
      setSelectedEvaluationId(trimmedEvaluationId);
    } catch (apiError) {
      if (apiError instanceof ApiClientError && apiError.status === 401) {
        navigate(ROUTES.login, { replace: true });
        return;
      }

      setError(apiError?.message || "Failed to load evaluation results.");
      setResults([]);
      setSelectedEvaluationId(trimmedEvaluationId);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell
      title="My Results"
      subtitle="Recent rows are preloaded, or search a specific evaluation run by ID."
    >
      <div className="toolbar-row">
        <div className="toolbar-item">
          <label htmlFor="resultsEnvName">Environment</label>
          <select
            id="resultsEnvName"
            value={envFilter}
            onChange={(event) => setEnvFilter(event.target.value)}
          >
            {ENV_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="toolbar-item">
          <label htmlFor="evaluationId">Evaluation ID</label>
          <input
            id="evaluationId"
            className="auth-input"
            value={evaluationIdInput}
            onChange={(event) => setEvaluationIdInput(event.target.value)}
            placeholder="evaluation-2026-02-18"
          />
        </div>

        <button
          className="secondary-btn"
          type="button"
          onClick={handleLoadResults}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load Results"}
        </button>
      </div>

      {error ? (
        <ErrorState
          title="Unable to load results"
          message={error}
          actionLabel="Try Again"
          onAction={handleLoadResults}
          compact
        />
      ) : null}

      {loading ? (
        <LoadingState message="Loading evaluation results..." compact />
      ) : results.length === 0 ? (
        <EmptyState
          title={
            showingEvaluationResults ? "No result rows" : "No recent results"
          }
          message={
            showingEvaluationResults
              ? `No user-scoped result rows were found for evaluation ${selectedEvaluationId}.`
              : prefillUnavailable
                ? "Recent prefill endpoint is unavailable. Enter an evaluation ID to fetch specific results."
                : selectedEnvName
                  ? `No recent rows were found for ${selectedEnvName}. Enter an evaluation ID to load specific results.`
                  : "No recent rows were found for your account. Enter an evaluation ID to load specific results."
          }
          compact
        />
      ) : (
        <div className="table-wrap">
          <table className="strategy-table">
            <thead>
              <tr>
                <th>Evaluation</th>
                <th>Rank</th>
                <th>Agent</th>
                <th>Total Return</th>
                <th>Average Return</th>
                <th>Fail Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => {
                const rowKey = row.resultId || row._id || row.agentId || index;
                const resultId = row.resultId || row._id || "";
                const evaluationId =
                  row.evaluationId || selectedEvaluationId || "";
                const rank = row.rank ?? "-";
                const agentId = row.agentId || "-";
                const totalReturn = row.totalReturn ?? row.metrics?.totalReturn;
                const averageReturn =
                  row.averageReturn ?? row.metrics?.averageReturn;
                const failRate = row.failRate ?? row.metrics?.failRate;

                return (
                  <tr key={rowKey}>
                    <td>{evaluationId}</td>
                    <td>{rank}</td>
                    <td>{agentId}</td>
                    <td>{totalReturn ?? "-"}</td>
                    <td>{averageReturn ?? "-"}</td>
                    <td>{failRate ?? "-"}</td>
                    <td>
                      <button
                        className="secondary-btn"
                        type="button"
                        disabled={!resultId}
                        onClick={() =>
                          navigate(ROUTES.app.resultById(resultId))
                        }
                      >
                        View
                      </button>
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

export default MyResults;
