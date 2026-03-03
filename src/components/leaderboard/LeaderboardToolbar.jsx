function LeaderboardToolbar({
  envOptions,
  envName,
  onEnvChange,
  evaluationIdInput,
  onEvaluationIdChange,
  onLoad,
  loading,
}) {
  return (
    <div className="toolbar-row">
      <div className="toolbar-item">
        <label htmlFor="leaderboardEnv">Environment</label>
        <select
          id="leaderboardEnv"
          value={envName}
          onChange={(event) => onEnvChange(event.target.value)}
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
      </div>

      <div className="toolbar-item">
        <label htmlFor="leaderboardEvaluationId">
          Evaluation ID (optional)
        </label>
        <input
          id="leaderboardEvaluationId"
          className="auth-input"
          value={evaluationIdInput}
          onChange={(event) => onEvaluationIdChange(event.target.value)}
          placeholder="evaluation-2026-02-18"
        />
      </div>

      <button
        className="secondary-btn"
        type="button"
        onClick={onLoad}
        disabled={loading}
      >
        {loading ? "Loading..." : "Load Leaderboard"}
      </button>
    </div>
  );
}

export default LeaderboardToolbar;
