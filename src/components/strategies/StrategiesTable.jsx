function StrategiesTable({
  strategies,
  envName,
  activatingId,
  deletingId,
  onSetActive,
  onEdit,
  onDelete,
}) {
  return (
    <div className="table-wrap">
      <table className="strategy-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Environment</th>
            <th>Status</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {strategies.map((strategy) => {
            const strategyId = strategy.strategyId || strategy._id || "";
            const updatedAt = strategy.updatedAt || strategy.createdAt || "-";

            return (
              <tr key={strategyId || strategy.name}>
                <td>{strategy.name || "Unnamed strategy"}</td>
                <td>{strategy.envName || envName}</td>
                <td>
                  {strategy.isActive ? (
                    <span className="status-badge active">Active</span>
                  ) : (
                    <span className="status-badge">Inactive</span>
                  )}
                </td>
                <td>{updatedAt}</td>
                <td>
                  <div className="action-row">
                    <button
                      className="secondary-btn"
                      disabled={
                        Boolean(strategy.isActive) ||
                        activatingId === strategyId ||
                        !strategyId
                      }
                      onClick={() => onSetActive(strategyId)}
                    >
                      {activatingId === strategyId
                        ? "Setting..."
                        : "Set Active"}
                    </button>

                    <button
                      className="secondary-btn"
                      disabled={!strategyId}
                      onClick={() => onEdit(strategyId)}
                    >
                      Edit
                    </button>

                    <button
                      className="secondary-btn danger"
                      disabled={deletingId === strategyId || !strategyId}
                      onClick={() => onDelete(strategyId, strategy.name)}
                    >
                      {deletingId === strategyId ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StrategiesTable;
