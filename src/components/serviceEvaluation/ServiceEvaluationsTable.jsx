function ServiceEvaluationsTable({
  evaluations,
  loadingDetail,
  selectedEvaluationId,
  selectedEvaluation,
  detailError,
  onInspectToggle,
}) {
  return (
    <div className="table-wrap">
      <table className="strategy-table">
        <thead>
          <tr>
            <th>Evaluation</th>
            <th>Environment</th>
            <th>Status</th>
            <th>Rounds</th>
            <th>Pool Size</th>
            <th>Pool Count</th>
            <th>Episodes / Pool</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evaluation, index) => {
            const evaluationId =
              evaluation.evaluationId || evaluation._id || "";
            const rowKey = evaluationId || `evaluation-${index}`;

            return (
              <tr key={rowKey}>
                <td>{evaluationId || "-"}</td>
                <td>{evaluation.envName || "-"}</td>
                <td>{evaluation.status || "-"}</td>
                <td>{evaluation.rounds ?? "-"}</td>
                <td>{evaluation.poolSize ?? "-"}</td>
                <td>{evaluation.poolCount ?? "-"}</td>
                <td>{evaluation.episodesPerPool ?? "-"}</td>
                <td>{evaluation.updatedAt || evaluation.createdAt || "-"}</td>
                <td>
                  <button
                    className="secondary-btn"
                    type="button"
                    disabled={!evaluationId || loadingDetail}
                    onClick={() => onInspectToggle(evaluationId)}
                  >
                    {loadingDetail && selectedEvaluationId === evaluationId
                      ? "Loading..."
                      : selectedEvaluationId === evaluationId &&
                          (selectedEvaluation || detailError)
                        ? "Hide"
                        : "Inspect"}
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

export default ServiceEvaluationsTable;
