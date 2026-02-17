import PageShell from "../components/PageShell";
import { EmptyState } from "../components/AsyncState";

function ServiceEvaluation() {
  return (
    <PageShell
      title="Service Evaluations"
      subtitle="Trigger evaluation runs and monitor asynchronous execution status."
    >
      <EmptyState
        title="No service jobs yet"
        message="Connect service evaluation actions and job-status polling to enable this panel."
      />
    </PageShell>
  );
}

export default ServiceEvaluation;
