import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { strategiesApi } from "../api/strategiesApi";
import { ApiClientError } from "../lib/apiClient";
import { verifyStrategySource } from "../lib/strategyCodeVerify";
import { ROUTES } from "../lib/routes";

export const DEFAULT_STRATEGY_ENV = "AuctionHouse";

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
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [envName, setEnvName] = useState(DEFAULT_STRATEGY_ENV);
  const [source, setSource] = useState("");
  const [metadataText, setMetadataText] = useState("{}");
  const [isActive, setIsActive] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

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
        setErrorWithToast(
          "Source code verification failed. Fix errors before saving.",
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
    ],
  );

  const handleVerifyCode = useCallback(() => {
    const verification = verifyStrategySource(source);
    setVerifyResult(verification);

    if (verification.ok) {
      setError("");
      return;
    }

    setErrorWithToast("Source code verification found issues.");
  }, [setErrorWithToast, source]);

  const handleCancel = useCallback(() => {
    navigate(ROUTES.app.strategies);
  }, [navigate]);

  return {
    isCreateMode,
    loading,
    saving,
    error,
    title,
    name,
    setName,
    envName,
    setEnvName,
    source,
    setSource,
    metadataText,
    setMetadataText,
    isActive,
    setIsActive,
    verifyResult,
    handleSubmit,
    handleVerifyCode,
    handleCancel,
  };
}
