import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { strategiesApi } from "../api/strategiesApi";
import { ApiClientError } from "../lib/apiClient";
import { verifyStrategySource } from "../lib/strategyCodeVerify";
import { ROUTES } from "../lib/routes";

export const DEFAULT_STRATEGY_ENV = "AuctionHouse";

const STRATEGY_SOURCE_TEMPLATE = `function reset() {
  // Initialize or reset your internal strategy state here.
  return null;  
}

function observe(obs) {
  // Consume market/game observations and update local state if needed.
  // Keep this side-effect free unless your strategy requires persistence.
  return obs || {};
}

function act(obs) {
  // Decide and return the next action based on the latest state/observation.
  // Return shape/value depends on the selected environment contract.
  return null;
}

export default {
  reset,
  observe,
  act,
};
`;

function parseMetadata(value) {
  if (!value.trim()) {
    return {};
  }

  return JSON.parse(value);
}

function normalizeStrategy(payload) {
  if (!payload) {
    return null;
  }

  return payload.strategy || payload.data || payload;
}

export default function useStrategyEditor(strategyId) {
  const navigate = useNavigate();
  const isCreateMode = !strategyId;

  const [loading, setLoading] = useState(!isCreateMode);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [envName, setEnvName] = useState(DEFAULT_STRATEGY_ENV);
  const [source, setSource] = useState(
    isCreateMode ? STRATEGY_SOURCE_TEMPLATE : "",
  );
  const [metadataText, setMetadataText] = useState("{}");
  const [isActive, setIsActive] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifiedSource, setVerifiedSource] = useState("");
  const [runResult, setRunResult] = useState(null);
  const [lastSuccessfulRunSource, setLastSuccessfulRunSource] = useState("");
  const [lastSuccessfulRunEnv, setLastSuccessfulRunEnv] = useState("");

  const setErrorWithToast = useCallback((message) => {
    setError(message);
    if (message) {
      toast.error(message);
    }
  }, []);

  const title = useMemo(
    () => (isCreateMode ? "Create Strategy" : "Edit Strategy"),
    [isCreateMode],
  );

  useEffect(() => {
    if (isCreateMode || !strategyId) {
      return;
    }

    let active = true;

    async function loadStrategy() {
      setLoading(true);
      setError("");

      try {
        const payload = await strategiesApi.getById(strategyId);
        const strategy = normalizeStrategy(payload);

        if (!active || !strategy) {
          return;
        }

        setName(strategy.name || "");
        setEnvName(strategy.envName || DEFAULT_STRATEGY_ENV);
        setSource(strategy.source || "");
        setMetadataText(JSON.stringify(strategy.metadata || {}, null, 2));
        setIsActive(Boolean(strategy.isActive));
        setVerifyResult(null);
        setVerifiedSource("");
        setRunResult(null);
        setLastSuccessfulRunSource("");
        setLastSuccessfulRunEnv("");
      } catch (apiError) {
        if (apiError instanceof ApiClientError && apiError.status === 401) {
          navigate(ROUTES.login, { replace: true });
          return;
        }

        if (active) {
          setErrorWithToast(
            apiError?.message || "Failed to load strategy details.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStrategy();

    return () => {
      active = false;
    };
  }, [isCreateMode, navigate, setErrorWithToast, strategyId]);

  const handleSourceChange = useCallback((value) => {
    setSource(value);
    setVerifyResult(null);
    setVerifiedSource("");
    setRunResult(null);
    setLastSuccessfulRunSource("");
    setLastSuccessfulRunEnv("");
  }, []);

  const handleEnvNameChange = useCallback((value) => {
    setEnvName(value);
    setVerifyResult(null);
    setVerifiedSource("");
    setRunResult(null);
    setLastSuccessfulRunSource("");
    setLastSuccessfulRunEnv("");
  }, []);

  const isRunEnabled = useMemo(
    () => Boolean(verifyResult?.ok) && verifiedSource === source,
    [source, verifiedSource, verifyResult],
  );

  const isSubmitEnabled = useMemo(
    () =>
      isRunEnabled &&
      lastSuccessfulRunSource === source &&
      lastSuccessfulRunEnv === envName,
    [
      envName,
      isRunEnabled,
      lastSuccessfulRunEnv,
      lastSuccessfulRunSource,
      source,
    ],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setError("");

      if (!name.trim()) {
        setErrorWithToast("Strategy name is required.");
        return;
      }

      if (!source.trim()) {
        setErrorWithToast("Strategy source code is required.");
        return;
      }

      const verification = verifyStrategySource(source);
      setVerifyResult(verification);
      if (!verification.ok) {
        setLastSuccessfulRunSource("");
        setLastSuccessfulRunEnv("");
        setErrorWithToast(
          "Source code verification failed. Fix errors before saving.",
        );
        return;
      }

      if (!isSubmitEnabled) {
        setErrorWithToast(
          "Run must succeed for the current verified source before saving.",
        );
        return;
      }

      let metadata = {};
      try {
        metadata = parseMetadata(metadataText);
      } catch {
        setErrorWithToast("Metadata must be valid JSON.");
        return;
      }

      setSaving(true);
      try {
        const payload = {
          name: name.trim(),
          envName,
          source,
          metadata,
          isActive,
        };

        if (isCreateMode) {
          await strategiesApi.create(payload);
        } else {
          await strategiesApi.update(strategyId, payload);
        }

        navigate(ROUTES.app.strategies, { replace: true });
      } catch (apiError) {
        if (apiError instanceof ApiClientError && apiError.status === 401) {
          navigate(ROUTES.login, { replace: true });
          return;
        }

        setErrorWithToast(apiError?.message || "Failed to save strategy.");
      } finally {
        setSaving(false);
      }
    },
    [
      envName,
      isActive,
      isCreateMode,
      metadataText,
      name,
      navigate,
      setErrorWithToast,
      source,
      strategyId,
      isSubmitEnabled,
    ],
  );

  const handleVerifyCode = useCallback(() => {
    const verification = verifyStrategySource(source);
    setVerifyResult(verification);

    if (verification.ok) {
      setError("");
      setVerifiedSource(source);
      return;
    }

    setVerifiedSource("");
    setLastSuccessfulRunSource("");
    setLastSuccessfulRunEnv("");
    setErrorWithToast("Source code verification found issues.");
  }, [setErrorWithToast, source]);

  const handleRun = useCallback(async () => {
    if (!isRunEnabled) {
      setErrorWithToast(
        "Run is available only after successful verification of the current source.",
      );
      return;
    }

    let metadata = {};
    try {
      metadata = parseMetadata(metadataText);
    } catch {
      setErrorWithToast("Metadata must be valid JSON.");
      return;
    }

    setError("");
    setRunning(true);
    setRunResult(null);
    setLastSuccessfulRunSource("");
    setLastSuccessfulRunEnv("");

    try {
      const response = await strategiesApi.sandboxRun({
        envName,
        source,
        metadata,
      });
      setRunResult(
        response === null || response === undefined
          ? { message: "Run completed with no response body." }
          : response,
      );
      setLastSuccessfulRunSource(source);
      setLastSuccessfulRunEnv(envName);

      toast.success("Sandbox run completed.");
    } catch (apiError) {
      if (apiError instanceof ApiClientError && apiError.status === 401) {
        navigate(ROUTES.login, { replace: true });
        return;
      }

      const errorCode = apiError?.data?.error || "RUN_FAILED";
      const humanMessage =
        apiError?.data?.message || apiError?.message || "Sandbox run failed.";

      setRunResult({
        ok: false,
        error: errorCode,
        message: humanMessage,
        status: apiError?.status || null,
        details: apiError?.data?.details ?? null,
        data: apiError?.data ?? null,
      });

      setErrorWithToast(humanMessage);
    } finally {
      setRunning(false);
    }
  }, [
    envName,
    isRunEnabled,
    metadataText,
    navigate,
    setErrorWithToast,
    source,
  ]);

  const handleCancel = useCallback(() => {
    navigate(ROUTES.app.strategies);
  }, [navigate]);

  return {
    isCreateMode,
    loading,
    saving,
    running,
    error,
    title,
    name,
    setName,
    envName,
    setEnvName: handleEnvNameChange,
    source,
    setSource: handleSourceChange,
    metadataText,
    setMetadataText,
    isActive,
    setIsActive,
    verifyResult,
    runResult,
    isRunEnabled,
    isSubmitEnabled,
    handleSubmit,
    handleVerifyCode,
    handleRun,
    handleCancel,
  };
}
