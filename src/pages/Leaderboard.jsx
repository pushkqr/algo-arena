import { useEffect } from "react";
import PageShell from "../components/PageShell";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import LeaderboardToolbar from "../components/leaderboard/LeaderboardToolbar";
import useLeaderboard from "../hooks/useLeaderboard";
import useEnvironmentCatalog from "../hooks/useEnvironmentCatalog";

function Leaderboard() {
  const {
    envName,
    setEnvName,
    evaluationIdInput,
    setEvaluationIdInput,
    rows,
    loading,
    error,
    queryMode,
    effectiveEvaluationId,
    effectiveLimit,
    effectiveSkip,
    hasNextPage,
    handleNextPage,
    handlePrevPage,
    loadLeaderboard,
  } = useLeaderboard();
  const {
    envOptions,
    envNames,
    error: envCatalogError,
    loading: loadingEnvCatalog,
  } = useEnvironmentCatalog();

  useEffect(() => {
    if (!envNames.length || envNames.includes(envName)) {
      return;
    }

    setEnvName(envNames[0]);
  }, [envName, envNames, setEnvName]);

  const resolvedEnvOptions =
    envOptions.length > 0 ? envOptions : [{ name: envName, label: envName }];

  const resolvedEvaluationId =
    effectiveEvaluationId || rows[0]?.evaluationId || "";

  return (
    <PageShell
      title="Leaderboard"
      subtitle="See ranked aggregate performance across strategies for an environment and evaluation."
    >
      <LeaderboardToolbar
        envOptions={resolvedEnvOptions}
        envName={envName}
        onEnvChange={setEnvName}
        evaluationIdInput={evaluationIdInput}
        onEvaluationIdChange={setEvaluationIdInput}
        onLoad={loadLeaderboard}
        loading={loading}
      />

      {envCatalogError ? (
        <ErrorState
          title="Unable to load environments"
          message={envCatalogError}
          compact
        />
      ) : null}

      <div className="action-row leaderboard-pager">
        <button
          className="secondary-btn"
          type="button"
          onClick={handlePrevPage}
          disabled={loading || effectiveSkip === 0}
        >
          Prev
        </button>
        <button
          className="secondary-btn"
          type="button"
          onClick={handleNextPage}
          disabled={loading || !hasNextPage}
        >
          Next
        </button>
        <span className="verify-meta">
          Showing rows {effectiveSkip + 1} to {effectiveSkip + effectiveLimit}
        </span>
      </div>

      {error ? (
        <ErrorState
          title="Unable to load leaderboard"
          message={error}
          actionLabel="Try Again"
          onAction={loadLeaderboard}
          compact
        />
      ) : null}

      {loading || loadingEnvCatalog ? (
        <LoadingState message="Loading leaderboard rows..." compact />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No leaderboard rows"
          message={
            queryMode === "evaluation"
              ? `No rows found for evaluation ${effectiveEvaluationId}.`
              : `No completed leaderboard rows found for ${envName}.`
          }
          compact
        />
      ) : (
        <LeaderboardTable rows={rows} evaluationId={resolvedEvaluationId} />
      )}
    </PageShell>
  );
}

export default Leaderboard;
