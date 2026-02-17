import { useParams } from "react-router-dom";
import PageShell from "../components/PageShell";

function ResultsDetail() {
  const { evaluationId } = useParams();

  return (
    <PageShell
      title="Evaluation Results"
      subtitle={`Aggregated metrics for evaluation ${evaluationId}.`}
    >
      <p className="body-text">
        Detail scaffold ready. Next: wire GET
        /api/results/evaluations/:evaluationId/results.
      </p>
    </PageShell>
  );
}

export default ResultsDetail;
