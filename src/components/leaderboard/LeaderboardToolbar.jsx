function LeaderboardToolbar({
  envOptions,
  envName,
  onEnvChange,
  showEnvBadge,
}) {
  return (
    <div className="toolbar-row">
      <div className="toolbar-item">
        <label htmlFor="leaderboardEnv">Environment</label>
        {showEnvBadge ? <span className="env-badge">New</span> : null}
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
    </div>
  );
}

export default LeaderboardToolbar;
