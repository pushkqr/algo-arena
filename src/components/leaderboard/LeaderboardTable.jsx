function LeaderboardTable({ rows, evaluationId }) {
  return (
    <div className="table-wrap">
      {evaluationId ? (
        <p className="verify-meta leaderboard-context">
          Evaluation: {evaluationId}
        </p>
      ) : null}
      <table className="strategy-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Total Return</th>
            <th>Average Return</th>
            <th>Fail Rate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const rowKey = row.resultId || row._id || row.agentId || index;
            const rank = row.rank ?? "-";
            const username =
              row.ownerProfile?.username ||
              row.username ||
              row.displayName ||
              "Unknown User";
            const totalReturn = row.totalReturn ?? row.metrics?.totalReturn;
            const averageReturn =
              row.averageReturn ?? row.metrics?.averageReturn;
            const failRate = row.failRate ?? row.metrics?.failRate;

            return (
              <tr key={rowKey}>
                <td>{rank}</td>
                <td>{username}</td>
                <td>{totalReturn ?? "-"}</td>
                <td>{averageReturn ?? "-"}</td>
                <td>{failRate ?? "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderboardTable;
