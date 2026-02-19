function StrategiesToolbar({
  envOptions,
  envName,
  onEnvChange,
  activeFilters,
  activeFilter,
  onActiveFilterChange,
  onRefresh,
  loading,
  onNewStrategy,
}) {
  return (
    <div className="toolbar-row">
      <div className="toolbar-item">
        <label htmlFor="envName">Environment</label>
        <select
          id="envName"
          value={envName}
          onChange={(event) => onEnvChange(event.target.value)}
        >
          {envOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar-item">
        <label htmlFor="activeFilter">Status</label>
        <select
          id="activeFilter"
          value={activeFilter}
          onChange={(event) => onActiveFilterChange(event.target.value)}
        >
          {activeFilters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      <button className="secondary-btn" onClick={onRefresh} disabled={loading}>
        Refresh
      </button>

      <button className="secondary-btn" onClick={onNewStrategy}>
        New Strategy
      </button>
    </div>
  );
}

export default StrategiesToolbar;
