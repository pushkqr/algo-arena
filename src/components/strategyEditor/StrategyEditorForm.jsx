import { Suspense, lazy } from "react";
import { LoadingState } from "../AsyncState";
import StrategyVerifyPanel from "./StrategyVerifyPanel";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));

function StrategyEditorForm({
  defaultEnv,
  name,
  onNameChange,
  envName,
  onEnvNameChange,
  source,
  onSourceChange,
  onVerifyCode,
  verifyResult,
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
          <option value={defaultEnv}>{defaultEnv}</option>
        </select>

        <label htmlFor="strategySource">Source Code</label>
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
        </div>

        <StrategyVerifyPanel verifyResult={verifyResult} />

        <label htmlFor="strategyMetadata">Metadata (JSON)</label>
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
        <button className="secondary-btn" type="submit" disabled={saving}>
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
