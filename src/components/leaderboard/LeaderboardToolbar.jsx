function LeaderboardToolbar({
  envOptions,
  envName,
  onEnvChange,
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
    </div>
  );
}

export default LeaderboardToolbar;
