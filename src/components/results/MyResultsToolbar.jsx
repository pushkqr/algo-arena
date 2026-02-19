function MyResultsToolbar({
  envFilters,
  envFilter,
  onEnvFilterChange,
  evaluationIdInput,
  onEvaluationIdChange,
  onLoadResults,
  loading,
}) {
  return (
    <div className="toolbar-row">
      <div className="toolbar-item">
        <label htmlFor="resultsEnvName">Environment</label>
        <select
          id="resultsEnvName"
          value={envFilter}
          onChange={(event) => onEnvFilterChange(event.target.value)}
        >
          {envFilters.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar-item">
        <label htmlFor="evaluationId">Evaluation ID</label>
        <input
          id="evaluationId"
          className="auth-input"
          value={evaluationIdInput}
          onChange={(event) => onEvaluationIdChange(event.target.value)}
          placeholder="evaluation-2026-02-18"
        />
      </div>

      <button
        className="secondary-btn"
        type="button"
        onClick={onLoadResults}
        disabled={loading}
      >
        {loading ? "Loading..." : "Load Results"}
      </button>
    </div>
  );
}

export default MyResultsToolbar;
