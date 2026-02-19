import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resultsApi } from "../api/resultsApi";
import { ApiClientError } from "../lib/apiClient";
import { ROUTES } from "../lib/routes";

const RECENT_LIMIT = 25;

export const RESULTS_ENV_FILTERS = [
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

export default function useMyResults() {
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

  const handleLoadResults = useCallback(async () => {
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
  }, [evaluationIdInput, navigate]);

  return {
    evaluationIdInput,
    setEvaluationIdInput,
    envFilter,
    setEnvFilter,
    selectedEvaluationId,
    results,
    loading,
    error,
    prefillUnavailable,
    selectedEnvName,
    showingEvaluationResults,
    handleLoadResults,
  };
}
