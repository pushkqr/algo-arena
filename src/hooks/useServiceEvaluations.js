import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { evaluationsApi } from "../api/evaluationsApi";
import { ApiClientError } from "../lib/apiClient";
import { ROUTES } from "../lib/routes";

export const SERVICE_ENV_OPTIONS = ["AuctionHouse"];

function normalizeEvaluationsResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.evaluations)) {
    return payload.evaluations;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function normalizeEvaluationResponse(payload) {
  if (!payload) {
    return null;
  }

  if (payload.evaluation && typeof payload.evaluation === "object") {
    return payload.evaluation;
  }

  if (payload.data && typeof payload.data === "object") {
    return payload.data;
  }

  if (typeof payload === "object") {
    return payload;
  }

  return null;
}

function sortByMostRecent(rows) {
  return [...rows].sort((left, right) => {
    const leftTs = Date.parse(left?.updatedAt || left?.createdAt || "");
    const rightTs = Date.parse(right?.updatedAt || right?.createdAt || "");

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

function asPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function extractEvaluationId(payload) {
  return (
    payload?.evaluationId ||
    payload?.evaluation?.evaluationId ||
    payload?.data?.evaluationId ||
    ""
  );
}

export default function useServiceEvaluations() {
  const navigate = useNavigate();

  const [envName, setEnvName] = useState(SERVICE_ENV_OPTIONS[0]);
  const [roundsInput, setRoundsInput] = useState("12");
  const [poolSizeInput, setPoolSizeInput] = useState("4");
  const [poolCountInput, setPoolCountInput] = useState("2");
  const [episodesInput, setEpisodesInput] = useState("8");
  const [shuffleInput, setShuffleInput] = useState("true");

  const [evaluations, setEvaluations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [listError, setListError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const [selectedEvaluationId, setSelectedEvaluationId] = useState("");
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  const detailRows = useMemo(() => {
    if (!selectedEvaluation) {
      return [];
    }

    return [
      ["Evaluation", selectedEvaluation.evaluationId],
      ["Environment", selectedEvaluation.envName],
      ["Status", selectedEvaluation.status],
      ["Rounds", selectedEvaluation.rounds],
      ["Pool Size", selectedEvaluation.poolSize],
      ["Pool Count", selectedEvaluation.poolCount],
      ["Episodes / Pool", selectedEvaluation.episodesPerPool],
      ["Shuffle", selectedEvaluation.shuffle],
      ["Created At", selectedEvaluation.createdAt],
      ["Updated At", selectedEvaluation.updatedAt],
      ["Metrics", selectedEvaluation.metrics],
      ["Ranking", selectedEvaluation.ranking],
    ];
  }, [selectedEvaluation]);

  const loadEvaluations = useCallback(async () => {
    setLoadingList(true);
    setListError("");

    try {
      const payload = await evaluationsApi.list();
      const normalized = normalizeEvaluationsResponse(payload);
      setEvaluations(sortByMostRecent(normalized));
    } catch (apiError) {
      if (apiError instanceof ApiClientError && apiError.status === 401) {
        navigate(ROUTES.login, { replace: true });
        return;
      }

      setEvaluations([]);
      setListError(apiError?.message || "Failed to load evaluations.");
    } finally {
      setLoadingList(false);
    }
  }, [navigate]);

  const loadEvaluationDetail = useCallback(
    async (evaluationId) => {
      if (!evaluationId) {
        return;
      }

      setSelectedEvaluationId(evaluationId);
      setLoadingDetail(true);
      setDetailError("");

      try {
        const payload = await evaluationsApi.getById(evaluationId);
        const normalized = normalizeEvaluationResponse(payload);
        if (!normalized) {
          setSelectedEvaluation(null);
          setDetailError("Evaluation detail is unavailable.");
          return;
        }

        setSelectedEvaluation(normalized);
      } catch (apiError) {
        if (apiError instanceof ApiClientError && apiError.status === 401) {
          navigate(ROUTES.login, { replace: true });
          return;
        }

        setSelectedEvaluation(null);
        setDetailError(
          apiError?.message || "Failed to load evaluation detail.",
        );
      } finally {
        setLoadingDetail(false);
      }
    },
    [navigate],
  );

  const handleInspectToggle = useCallback(
    (evaluationId) => {
      if (!evaluationId) {
        return;
      }

      const isSameEvaluation = selectedEvaluationId === evaluationId;
      const hasOpenDetail = Boolean(selectedEvaluation || detailError);

      if (isSameEvaluation && hasOpenDetail && !loadingDetail) {
        setSelectedEvaluationId("");
        setSelectedEvaluation(null);
        setDetailError("");
        return;
      }

      loadEvaluationDetail(evaluationId);
    },
    [
      detailError,
      loadEvaluationDetail,
      loadingDetail,
      selectedEvaluation,
      selectedEvaluationId,
    ],
  );

  useEffect(() => {
    loadEvaluations();
  }, [loadEvaluations]);

  const handleStartEvaluation = useCallback(async () => {
    setSubmitting(true);
    setSubmitError("");
    setSubmitMessage("");

    try {
      const payload = await evaluationsApi.start({
        envName,
        rounds: asPositiveInteger(roundsInput, 12),
        poolSize: asPositiveInteger(poolSizeInput, 4),
        poolCount: asPositiveInteger(poolCountInput, 2),
        episodesPerPool: asPositiveInteger(episodesInput, 8),
        shuffle: shuffleInput === "true",
      });

      const evaluationId = extractEvaluationId(payload);
      setSubmitMessage(
        evaluationId
          ? `Evaluation queued: ${evaluationId}`
          : "Evaluation queued successfully.",
      );

      await loadEvaluations();

      if (evaluationId) {
        loadEvaluationDetail(evaluationId);
      }
    } catch (apiError) {
      if (apiError instanceof ApiClientError && apiError.status === 401) {
        navigate(ROUTES.login, { replace: true });
        return;
      }

      setSubmitError(apiError?.message || "Failed to start evaluation.");
    } finally {
      setSubmitting(false);
    }
  }, [
    envName,
    episodesInput,
    loadEvaluations,
    loadEvaluationDetail,
    navigate,
    poolCountInput,
    poolSizeInput,
    roundsInput,
    shuffleInput,
  ]);

  return {
    envName,
    setEnvName,
    roundsInput,
    setRoundsInput,
    poolSizeInput,
    setPoolSizeInput,
    poolCountInput,
    setPoolCountInput,
    episodesInput,
    setEpisodesInput,
    shuffleInput,
    setShuffleInput,
    evaluations,
    loadingList,
    submitting,
    listError,
    submitError,
    submitMessage,
    selectedEvaluationId,
    selectedEvaluation,
    loadingDetail,
    detailError,
    detailRows,
    loadEvaluations,
    loadEvaluationDetail,
    handleInspectToggle,
    handleStartEvaluation,
  };
}
