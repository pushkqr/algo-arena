import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { evaluationsApi } from "../api/evaluationsApi";
import { ApiClientError } from "../lib/apiClient";
import { ROUTES } from "../lib/routes";
import {
  normalizeEvaluationResponse,
  normalizeEvaluationsResponse,
  sortByMostRecent,
} from "./serviceEvaluationsUtils";

export default function useServiceEvaluationData() {
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");

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

  useEffect(() => {
    loadEvaluations();
  }, [loadEvaluations]);

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

  return {
    evaluations,
    loadingList,
    listError,
    selectedEvaluationId,
    selectedEvaluation,
    loadingDetail,
    detailError,
    detailRows,
    loadEvaluations,
    loadEvaluationDetail,
    handleInspectToggle,
  };
}
