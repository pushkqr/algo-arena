import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { evaluationsApi } from "../api/evaluationsApi";
import { ApiClientError } from "../lib/apiClient";
import { ROUTES } from "../lib/routes";
import {
  asPositiveInteger,
  buildEnvOptsPayload,
  buildInitialEnvOptionValues,
  extractEvaluationId,
  normalizeEnvOptionParam,
  normalizeEnvOptionsResponse,
} from "./serviceEvaluationsUtils";

export const SERVICE_ENV_OPTIONS = ["AuctionHouse"];

export default function useServiceEvaluationQueue({
  loadEvaluations,
  loadEvaluationDetail,
}) {
  const navigate = useNavigate();

  const [envName, setEnvName] = useState(SERVICE_ENV_OPTIONS[0]);
  const [poolSizeInput, setPoolSizeInput] = useState("4");
  const [poolCountInput, setPoolCountInput] = useState("2");
  const [episodesInput, setEpisodesInput] = useState("8");
  const [shuffleInput, setShuffleInput] = useState("true");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const [envOptionParams, setEnvOptionParams] = useState([]);
  const [envOptionValues, setEnvOptionValues] = useState({});
  const [loadingEnvOptions, setLoadingEnvOptions] = useState(false);
  const [envOptionsError, setEnvOptionsError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEnvOptions() {
      setLoadingEnvOptions(true);
      setEnvOptionsError("");

      try {
        const payload = await evaluationsApi.getEnvOptions(envName);
        if (!active) {
          return;
        }

        const normalizedParams = normalizeEnvOptionsResponse(payload, envName)
          .map(normalizeEnvOptionParam)
          .filter((param) => Boolean(param.key));

        setEnvOptionParams(normalizedParams);
        setEnvOptionValues(buildInitialEnvOptionValues(normalizedParams));
      } catch (apiError) {
        if (!active) {
          return;
        }

        if (apiError instanceof ApiClientError && apiError.status === 401) {
          navigate(ROUTES.login, { replace: true });
          return;
        }

        setEnvOptionParams([]);
        setEnvOptionValues({});
        setEnvOptionsError(
          apiError?.message || "Failed to load environment options.",
        );
      } finally {
        if (active) {
          setLoadingEnvOptions(false);
        }
      }
    }

    loadEnvOptions();

    return () => {
      active = false;
    };
  }, [envName, navigate]);

  const handleEnvOptionChange = useCallback((key, value) => {
    setEnvOptionValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleStartEvaluation = useCallback(async () => {
    setSubmitting(true);
    setSubmitError("");
    setSubmitMessage("");

    const { envOpts, errors } = buildEnvOptsPayload(
      envOptionParams,
      envOptionValues,
    );

    if (errors.length > 0) {
      setSubmitting(false);
      setSubmitError(errors.join(" "));
      return;
    }

    try {
      const payload = await evaluationsApi.start({
        envName,
        poolSize: asPositiveInteger(poolSizeInput, 4),
        poolCount: asPositiveInteger(poolCountInput, 2),
        episodesPerPool: asPositiveInteger(episodesInput, 8),
        shuffle: shuffleInput === "true",
        ...(Object.keys(envOpts).length > 0 ? { envOpts } : {}),
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
    envOptionParams,
    envOptionValues,
    episodesInput,
    loadEvaluations,
    loadEvaluationDetail,
    navigate,
    poolCountInput,
    poolSizeInput,
    shuffleInput,
  ]);

  return {
    envName,
    setEnvName,
    poolSizeInput,
    setPoolSizeInput,
    poolCountInput,
    setPoolCountInput,
    episodesInput,
    setEpisodesInput,
    shuffleInput,
    setShuffleInput,
    submitting,
    submitError,
    submitMessage,
    envOptionParams,
    envOptionValues,
    loadingEnvOptions,
    envOptionsError,
    handleEnvOptionChange,
    handleStartEvaluation,
  };
}
