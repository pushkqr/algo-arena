import { useParams } from "react-router-dom";
import { EmptyState } from "../components/AsyncState";
import PageShell from "../components/PageShell";

function ResultsDetail() {
  const { evaluationId } = useParams();

  return (
    <PageShell
      title="Evaluation Results"
      subtitle={`Aggregated metrics for evaluation ${evaluationId}.`}
    >
      <EmptyState
        title="Evaluation results unavailable"
        message={`Connect the results endpoint to load metrics for evaluation ${evaluationId}.`}
      />
    </PageShell>
  );
}

export default ResultsDetail;
