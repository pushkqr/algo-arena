import PageShell from "../components/PageShell";

function MyResults() {
  return (
    <PageShell
      title="My Results"
      subtitle="Inspect your aggregate results for a selected evaluation run."
    >
      <p className="body-text">
        UI shell ready. Next: add evaluation picker + results table.
      </p>
    </PageShell>
  );
}

export default MyResults;