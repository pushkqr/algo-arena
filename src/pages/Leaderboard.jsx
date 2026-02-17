import PageShell from "../components/PageShell";
import { EmptyState } from "../components/AsyncState";

function Leaderboard() {
  return (
    <PageShell
      title="Leaderboard"
      subtitle="See ranked aggregate performance across strategies for an environment and evaluation."
    >
      <EmptyState
        title="Leaderboard data pending"
        message="Wire leaderboard endpoints to populate ranked strategy performance."
      />
    </PageShell>
  );
}

export default Leaderboard;
