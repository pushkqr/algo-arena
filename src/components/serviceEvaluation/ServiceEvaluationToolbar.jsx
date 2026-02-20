import { useState } from "react";
import { NULL_OPTION_VALUE } from "../../hooks/serviceEvaluationsUtils";

function ServiceEvaluationToolbar({
  envOptions,
  envName,
  onEnvNameChange,
  poolSizeInput,
  onPoolSizeChange,
  poolCountInput,
  onPoolCountChange,
  episodesInput,
  onEpisodesChange,
  shuffleInput,
  onShuffleChange,
  submitting,
  onQueue,
  envOptionParams,
  envOptionValues,
  onEnvOptionChange,
  loadingEnvOptions,
  loadingList,
  onRefresh,
}) {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  function renderEnvOptionField(param) {
    const fieldId = `envOpt-${param.key}`;
    const fieldValue = envOptionValues[param.key] ?? "";

    if (param.type === "boolean") {
      return (
        <select
          id={fieldId}
          value={fieldValue}
          onChange={(event) => onEnvOptionChange(param.key, event.target.value)}
        >
          {param.nullable ? (
            <option value={NULL_OPTION_VALUE}>null</option>
          ) : null}
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      );
    }

    if (param.enum.length > 0) {
      return (
        <select
          id={fieldId}
          value={fieldValue}
          onChange={(event) => onEnvOptionChange(param.key, event.target.value)}
        >
          {param.nullable ? (
            <option value={NULL_OPTION_VALUE}>null</option>
          ) : null}
          {!param.required && !param.nullable ? (
            <option value="">(empty)</option>
          ) : null}
          {param.enum.map((option) => (
            <option key={option} value={String(option)}>
              {String(option)}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={fieldId}
        className="auth-input"
        type={param.type === "number" ? "number" : "text"}
        value={fieldValue}
        onChange={(event) => onEnvOptionChange(param.key, event.target.value)}
        placeholder={param.nullable ? "Enter value or use null" : "Enter value"}
      />
    );
  }

  return (
    <div className="service-eval-toolbar">
      <div className="toolbar-row service-eval-core-grid">
        <div className="toolbar-item">
          <label htmlFor="serviceEnv">Environment</label>
          <select
            id="serviceEnv"
            value={envName}
            onChange={(event) => onEnvNameChange(event.target.value)}
          >
            {envOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="toolbar-item">
          <label htmlFor="poolSize">Pool Size</label>
          <input
            id="poolSize"
            className="auth-input"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={poolSizeInput}
            onChange={(event) => onPoolSizeChange(event.target.value)}
          />
        </div>

        <div className="toolbar-item">
          <label htmlFor="poolCount">Pool Count</label>
          <input
            id="poolCount"
            className="auth-input"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={poolCountInput}
            onChange={(event) => onPoolCountChange(event.target.value)}
          />
        </div>

        <div className="toolbar-item">
          <label htmlFor="episodesPerPool">Episodes / Pool</label>
          <input
            id="episodesPerPool"
            className="auth-input"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={episodesInput}
            onChange={(event) => onEpisodesChange(event.target.value)}
          />
        </div>

        <div className="toolbar-item">
          <label htmlFor="shuffle">Shuffle</label>
          <select
            id="shuffle"
            value={shuffleInput}
            onChange={(event) => onShuffleChange(event.target.value)}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      </div>

      <div className="service-eval-actions">
        <button
          className="secondary-btn service-eval-primary-action"
          type="button"
          onClick={onQueue}
          disabled={submitting || loadingEnvOptions}
        >
          {submitting
            ? "Queuing..."
            : loadingEnvOptions
              ? "Loading env options..."
              : "Queue Evaluation"}
        </button>

        <button
          className="secondary-btn"
          type="button"
          onClick={onRefresh}
          disabled={loadingList}
        >
          {loadingList ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {envOptionParams.length > 0 ? (
        <div className="service-eval-advanced">
          <button
            className="secondary-btn"
            type="button"
            onClick={() => setShowAdvancedOptions((current) => !current)}
          >
            {showAdvancedOptions
              ? "Hide Advanced Environment Options"
              : `Show Advanced Environment Options (${envOptionParams.length})`}
          </button>

          {showAdvancedOptions ? (
            <div className="toolbar-row service-eval-advanced-grid">
              {envOptionParams.map((param) => (
                <div className="toolbar-item" key={param.key}>
                  <label htmlFor={`envOpt-${param.key}`}>{param.key}</label>
                  {renderEnvOptionField(param)}
                  {param.description ? (
                    <small>{param.description}</small>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default ServiceEvaluationToolbar;
