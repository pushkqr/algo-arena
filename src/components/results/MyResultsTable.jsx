function MyResultsTable({ results, selectedEvaluationId, onView }) {
  return (
    <div className="table-wrap">
      <table className="strategy-table">
        <thead>
          <tr>
            <th>Evaluation</th>
            <th>Rank</th>
            <th>Agent</th>
            <th>Total Return</th>
            <th>Average Return</th>
            <th>Fail Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row, index) => {
            const rowKey = row.resultId || row._id || row.agentId || index;
            const resultId = row.resultId || row._id || "";
            const evaluationId = row.evaluationId || selectedEvaluationId || "";
            const rank = row.rank ?? "-";
            const agentId = row.agentId || "-";
            const totalReturn = row.totalReturn ?? row.metrics?.totalReturn;
            const averageReturn =
              row.averageReturn ?? row.metrics?.averageReturn;
            const failRate = row.failRate ?? row.metrics?.failRate;

            return (
              <tr key={rowKey}>
                <td>{evaluationId}</td>
                <td>{rank}</td>
                <td>{agentId}</td>
                <td>{totalReturn ?? "-"}</td>
                <td>{averageReturn ?? "-"}</td>
                <td>{failRate ?? "-"}</td>
                <td>
                  <button
                    className="secondary-btn"
                    type="button"
                    disabled={!resultId}
                    onClick={() => onView(resultId)}
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MyResultsTable;
