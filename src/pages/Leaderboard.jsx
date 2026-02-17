import PageShell from "../components/PageShell";

function Leaderboard() {
  return (
    <PageShell
      title="Leaderboard"
      subtitle="See ranked aggregate performance across strategies for an environment and evaluation."
    >
      <p className="body-text">
        UI shell ready. Next: fetch and render ranked leaderboard rows.
      </p>
    </PageShell>
  );
}

export default Leaderboard;