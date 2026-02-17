import PageShell from "../components/PageShell";
import { EmptyState } from "../components/AsyncState";

function MyResults() {
  return (
    <PageShell
      title="My Results"
      subtitle="Inspect your aggregate results for a selected evaluation run."
    >
      <EmptyState
        title="No evaluations loaded"
        message="Connect the results API to show evaluation runs and aggregate metrics."
      />
    </PageShell>
  );
}

export default MyResults;
