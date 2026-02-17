import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import { strategiesApi } from "../api/strategiesApi";
import { ApiClientError } from "../lib/apiClient";
import { verifyStrategySource } from "../lib/strategyCodeVerify";
import { ROUTES } from "../lib/routes";

const DEFAULT_ENV = "AuctionHouse";
const MonacoEditor = lazy(() => import("@monaco-editor/react"));

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

function StrategyEditor() {
  const navigate = useNavigate();
  const { strategyId } = useParams();
  const isCreateMode = !strategyId;
  const [loading, setLoading] = useState(!isCreateMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [envName, setEnvName] = useState(DEFAULT_ENV);
  const [source, setSource] = useState("");
  const [metadataText, setMetadataText] = useState("{}");
  const [isActive, setIsActive] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

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
        setEnvName(strategy.envName || DEFAULT_ENV);
        setSource(strategy.source || "");
        setMetadataText(JSON.stringify(strategy.metadata || {}, null, 2));
        setIsActive(Boolean(strategy.isActive));
      } catch (apiError) {
        if (apiError instanceof ApiClientError && apiError.status === 401) {
          navigate(ROUTES.login, { replace: true });
          return;
        }

        if (active) {
          setError(apiError?.message || "Failed to load strategy details.");
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
  }, [isCreateMode, navigate, strategyId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Strategy name is required.");
      return;
    }

    if (!source.trim()) {
      setError("Strategy source code is required.");
      return;
    }

    const verification = verifyStrategySource(source);
    setVerifyResult(verification);
    if (!verification.ok) {
      setError("Source code verification failed. Fix errors before saving.");
      return;
    }

    let metadata = {};
    try {
      metadata = parseMetadata(metadataText);
    } catch {
      setError("Metadata must be valid JSON.");
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

      setError(apiError?.message || "Failed to save strategy.");
    } finally {
      setSaving(false);
    }
  }

  function handleVerifyCode() {
    const verification = verifyStrategySource(source);
    setVerifyResult(verification);

    if (verification.ok) {
      setError("");
      return;
    }

    setError("Source code verification found issues.");
  }

  return (
    <PageShell
      title={title}
      subtitle="Code editor + metadata form for strategy source and configuration."
    >
      {loading ? (
        <p className="body-text">Loading strategy...</p>
      ) : (
        <form className="strategy-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label htmlFor="strategyName">Strategy Name</label>
            <input
              id="strategyName"
              className="auth-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Mean Reversion v1"
            />

            <label htmlFor="strategyEnv">Environment</label>
            <select
              id="strategyEnv"
              className="auth-input"
              value={envName}
              onChange={(event) => setEnvName(event.target.value)}
            >
              <option value={DEFAULT_ENV}>{DEFAULT_ENV}</option>
            </select>

            <label htmlFor="strategySource">Source Code</label>
            <div className="code-editor-shell" id="strategySource">
              <Suspense
                fallback={<p className="body-text">Loading editor...</p>}
              >
                <MonacoEditor
                  height="360px"
                  defaultLanguage="javascript"
                  value={source}
                  onChange={(value) => setSource(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    tabSize: 2,
                    automaticLayout: true,
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                  }}
                />
              </Suspense>
            </div>

            <div className="action-row">
              <button
                className="secondary-btn"
                type="button"
                onClick={handleVerifyCode}
              >
                Verify Code
              </button>
            </div>

            {verifyResult && (
              <div className="verify-panel">
                <p className={verifyResult.ok ? "verify-ok" : "verify-fail"}>
                  {verifyResult.ok
                    ? "Code verification passed."
                    : "Code verification failed."}
                </p>
                <p className="verify-meta">
                  Risk score: {verifyResult.riskScore ?? 0}/100 · Errors:{" "}
                  {verifyResult.errors?.length ?? 0} · Warnings:{" "}
                  {verifyResult.warnings?.length ?? 0}
                </p>
                <p className="verify-meta">
                  Contract: {verifyResult.contract?.style || "unknown"} ·
                  Methods:{" "}
                  {(verifyResult.contract?.methods || []).length > 0
                    ? (verifyResult.contract.methods || []).join(", ")
                    : "none"}
                </p>
                {verifyResult.issues.length > 0 && (
                  <ul className="verify-list">
                    {verifyResult.issues.map((issue, index) => (
                      <li key={`${issue.type}-${index}`}>
                        [{issue.type.toUpperCase()}] {issue.message}
                        {issue.line ? ` (line ${issue.line})` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <label htmlFor="strategyMetadata">Metadata (JSON)</label>
            <textarea
              id="strategyMetadata"
              className="code-input"
              value={metadataText}
              onChange={(event) => setMetadataText(event.target.value)}
              rows={8}
            />
          </div>

          <label className="checkbox-row" htmlFor="strategyActive">
            <input
              id="strategyActive"
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
            />
            <span>Mark as active</span>
          </label>

          {error && <p className="auth-error">{error}</p>}

          <div className="action-row">
            <button
              className="secondary-btn"
              type="button"
              onClick={() => navigate(ROUTES.app.strategies)}
            >
              Cancel
            </button>
            <button className="secondary-btn" type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : isCreateMode
                  ? "Create Strategy"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </PageShell>
  );
}

export default StrategyEditor;
