import { useCallback, useEffect, useState } from "react";
import { leaderboardApi } from "../api/leaderboardApi";
import { ApiClientError } from "../lib/apiClient";

const DEFAULT_LIMIT = 10;

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
  const [envName, setEnvName] = useState("AuctionHouse");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const effectiveLimit = DEFAULT_LIMIT;

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    setError("");

    const query = {
      envName,
      limit: effectiveLimit,
      skip: 0,
    };

    try {
      const payload = await leaderboardApi.listEvaluations(query);
      const normalized = normalizeLeaderboardResponse(payload);
      setRows(sortByRank(normalized));
    } catch (apiError) {
      if (apiError instanceof ApiClientError && apiError.status === 401) {
        setRows([]);
        setError("Leaderboard is unavailable right now.");
        return;
      }

      setRows([]);
      setError(apiError?.message || "Failed to load leaderboard rows.");
    } finally {
      setLoading(false);
    }
  }, [effectiveLimit, envName]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  return {
    envName,
    setEnvName,
    rows,
    loading,
    error,
    effectiveLimit,
    loadLeaderboard,
  };
}
