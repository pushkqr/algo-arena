function ServiceEvaluationToolbar({
  envOptions,
  envName,
  onEnvNameChange,
  roundsInput,
  onRoundsChange,
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
  loadingList,
  onRefresh,
}) {
  return (
    <div className="toolbar-row">
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
        <label htmlFor="rounds">Rounds</label>
        <input
          id="rounds"
          className="auth-input"
          value={roundsInput}
          onChange={(event) => onRoundsChange(event.target.value)}
        />
      </div>

      <div className="toolbar-item">
        <label htmlFor="poolSize">Pool Size</label>
        <input
          id="poolSize"
          className="auth-input"
          value={poolSizeInput}
          onChange={(event) => onPoolSizeChange(event.target.value)}
        />
      </div>

      <div className="toolbar-item">
        <label htmlFor="poolCount">Pool Count</label>
        <input
          id="poolCount"
          className="auth-input"
          value={poolCountInput}
          onChange={(event) => onPoolCountChange(event.target.value)}
        />
      </div>

      <div className="toolbar-item">
        <label htmlFor="episodesPerPool">Episodes / Pool</label>
        <input
          id="episodesPerPool"
          className="auth-input"
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

      <button
        className="secondary-btn"
        type="button"
        onClick={onQueue}
        disabled={submitting}
      >
        {submitting ? "Queuing..." : "Queue Evaluation"}
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
  );
}

export default ServiceEvaluationToolbar;
