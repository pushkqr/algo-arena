import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { strategiesApi } from "../api/strategiesApi";
import { ApiClientError } from "../lib/apiClient";
import { ROUTES } from "../lib/routes";

export const DEFAULT_STRATEGY_ENV = "AuctionHouse";
export const STRATEGY_ENV_OPTIONS = ["AuctionHouse"];

export const STRATEGY_ACTIVE_FILTERS = [
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

export default function useStrategies() {
  const navigate = useNavigate();
  const [envName, setEnvName] = useState(DEFAULT_STRATEGY_ENV);
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

  const handleSetActive = useCallback(
    async (strategyId) => {
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
    },
    [envName, fetchStrategies, navigate],
  );

  const handleDelete = useCallback(
    async (strategyId, strategyName) => {
      const hasConfirmed = window.confirm(
        `Delete strategy "${strategyName || "Unnamed strategy"}"?`,
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
    },
    [fetchStrategies, navigate],
  );

  return {
    envName,
    setEnvName,
    activeFilter,
    setActiveFilter,
    strategies,
    loading,
    error,
    activatingId,
    deletingId,
    fetchStrategies,
    handleSetActive,
    handleDelete,
  };
}
