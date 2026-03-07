import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { LoadingState } from "../AsyncState";
import StrategyVerifyPanel from "./StrategyVerifyPanel";
import { ROUTES } from "../../lib/routes";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));

function formatRunResult(value) {
  if (typeof value === "string") {
    return value;
  }

  if (value === null || value === undefined) {
    return "";
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function StrategyEditorForm({
  envOptions,
  name,
  onNameChange,
  envName,
  onEnvNameChange,
  source,
  onSourceChange,
  onVerifyCode,
  onRun,
  canRun,
  running,
  verifyResult,
  runResult,
  canSubmit,
  metadataText,
  onMetadataTextChange,
  isActive,
  onIsActiveChange,
  error,
  onCancel,
  onSubmit,
  saving,
  isCreateMode,
}) {
  const environmentDocsRoute = envName
    ? ROUTES.docsEnvironment(envName)
    : ROUTES.docsSection("environments");

  return (
    <form className="strategy-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label htmlFor="strategyName">Strategy Name</label>
        <input
          id="strategyName"
          className="auth-input"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Mean Reversion v1"
        />

        <label htmlFor="strategyEnv">Environment</label>
        <select
          id="strategyEnv"
          className="auth-input"
          value={envName}
          onChange={(event) => onEnvNameChange(event.target.value)}
        >
          {envOptions.map((option) => {
            const optionValue =
              typeof option === "string" ? option : option.name;
            const optionLabel =
              typeof option === "string" ? option : option.label || option.name;

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>

        <label htmlFor="strategySource">Source Code</label>
        <p className="docs-inline-hint">
          Not sure what to put here? See the{" "}
          <Link className="docs-inline-link" to={environmentDocsRoute}>
            Environment Docs
          </Link>
          .
        </p>
        <div className="code-editor-shell" id="strategySource">
          <Suspense
            fallback={<LoadingState message="Loading editor..." compact />}
          >
            <MonacoEditor
              height="360px"
              defaultLanguage="javascript"
              value={source}
              onChange={(value) => onSourceChange(value || "")}
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
            onClick={onVerifyCode}
          >
            Verify Code
          </button>
          <button
            className="secondary-btn"
            type="button"
            onClick={onRun}
            disabled={!canRun || running}
          >
            {running ? "Running..." : "Run"}
          </button>
          <Link
            className="docs-inline-link"
            to={ROUTES.docsSection("verification")}
          >
            Verification Guide
          </Link>
        </div>

        <StrategyVerifyPanel verifyResult={verifyResult} />

        {runResult ? (
          <div className="verify-panel">
            <p
              className={runResult?.ok === false ? "verify-fail" : "verify-ok"}
            >
              {runResult?.ok === false
                ? "Last sandbox run error"
                : "Last sandbox run output"}
            </p>
            <pre className="run-output">{formatRunResult(runResult)}</pre>
          </div>
        ) : null}

        <label htmlFor="strategyMetadata">Metadata (JSON)</label>
        <p className="docs-inline-hint">
          Not sure what to put here? See the{" "}
          <Link
            className="docs-inline-link"
            to={ROUTES.docsSection("metadata")}
          >
            Metadata Docs
          </Link>
          .
        </p>
        <textarea
          id="strategyMetadata"
          className="code-input"
          value={metadataText}
          onChange={(event) => onMetadataTextChange(event.target.value)}
          rows={8}
        />
      </div>

      <label className="checkbox-row" htmlFor="strategyActive">
        <input
          id="strategyActive"
          type="checkbox"
          checked={isActive}
          onChange={(event) => onIsActiveChange(event.target.checked)}
        />
        <span>Mark as active</span>
      </label>

      {error && <p className="auth-error">{error}</p>}

      <div className="action-row">
        <button className="secondary-btn" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="secondary-btn"
          type="submit"
          disabled={saving || running || !canSubmit}
        >
          {saving
            ? "Saving..."
            : isCreateMode
              ? "Create Strategy"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default StrategyEditorForm;
