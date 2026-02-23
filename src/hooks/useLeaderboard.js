import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { leaderboardApi } from "../api/leaderboardApi";
import { ApiClientError } from "../lib/apiClient";
import { ROUTES } from "../lib/routes";

const DEFAULT_LIMIT = 25;
const DEFAULT_SKIP = 0;

export const LEADERBOARD_ENV_OPTIONS = ["AuctionHouse"];

function normalizeLeaderboardResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.rows)) {
    return payload.rows;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.leaderboard)) {
    return payload.leaderboard;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.rows)) {
    return payload.data.rows;
  }

  return [];
}

function sortByRank(rows) {
  return [...rows].sort((left, right) => {
    const leftRank = Number(left?.rank);
    const rightRank = Number(right?.rank);

    if (Number.isNaN(leftRank) && Number.isNaN(rightRank)) {
      return 0;
    }
    if (Number.isNaN(leftRank)) {
      return 1;
    }
    if (Number.isNaN(rightRank)) {
      return -1;
    }

    return leftRank - rightRank;
  });
}

export default function useLeaderboard() {
  const navigate = useNavigate();

  const [envName, setEnvName] = useState(LEADERBOARD_ENV_OPTIONS[0]);
  const [evaluationIdInput, setEvaluationIdInput] = useState("");
  const [skip, setSkip] = useState(DEFAULT_SKIP);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [queryMode, setQueryMode] = useState("env");
  const [hasNextPage, setHasNextPage] = useState(false);

  const effectiveEvaluationId = useMemo(
    () => evaluationIdInput.trim(),
    [evaluationIdInput],
  );

  const effectiveLimit = DEFAULT_LIMIT;
  const effectiveSkip = skip;

  const handleNextPage = useCallback(() => {
    if (!hasNextPage) {
      return;
    }

    setSkip((current) => current + effectiveLimit);
  }, [effectiveLimit, hasNextPage]);

  const handlePrevPage = useCallback(() => {
    setSkip((current) => Math.max(0, current - effectiveLimit));
  }, [effectiveLimit]);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    setError("");

    const query = effectiveEvaluationId
      ? {
          evaluationId: effectiveEvaluationId,
          limit: effectiveLimit,
          skip: effectiveSkip,
        }
      : {
          envName,
          limit: effectiveLimit,
          skip: effectiveSkip,
        };

    try {
      const payload = await leaderboardApi.listEvaluations(query);
      const normalized = normalizeLeaderboardResponse(payload);
      setRows(sortByRank(normalized));
      setHasNextPage(normalized.length >= effectiveLimit);
      setQueryMode(effectiveEvaluationId ? "evaluation" : "env");
    } catch (apiError) {
      if (apiError instanceof ApiClientError && apiError.status === 401) {
        navigate(ROUTES.login, { replace: true });
        return;
      }

      setRows([]);
      setHasNextPage(false);
      setError(apiError?.message || "Failed to load leaderboard rows.");
    } finally {
      setLoading(false);
    }
  }, [effectiveEvaluationId, effectiveLimit, effectiveSkip, envName, navigate]);

  useEffect(() => {
    setSkip(DEFAULT_SKIP);
  }, [effectiveEvaluationId, envName]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  return {
    envName,
    setEnvName,
    evaluationIdInput,
    setEvaluationIdInput,
    rows,
    loading,
    error,
    queryMode,
    effectiveEvaluationId,
    effectiveLimit,
    effectiveSkip,
    hasNextPage,
    handleNextPage,
    handlePrevPage,
    loadLeaderboard,
  };
}
