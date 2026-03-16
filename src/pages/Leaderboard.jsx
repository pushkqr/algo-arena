import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import LeaderboardToolbar from "../components/leaderboard/LeaderboardToolbar";
import NextStepsPanel from "../components/NextStepsPanel";
import { resultsApi } from "../api/resultsApi";
import useAuthState from "../hooks/useAuthState";
import useLeaderboard from "../hooks/useLeaderboard";
import useEnvironmentCatalog from "../hooks/useEnvironmentCatalog";
import useNewEnvironments from "../hooks/useNewEnvironments";
import { ROUTES } from "../lib/routes";

function Leaderboard() {
  const navigate = useNavigate();
  const { envName, setEnvName, rows, loading, error, loadLeaderboard } =
    useLeaderboard();
  const { isAuthenticated, user, sessionUser } = useAuthState();
  const currentUserId = user?.uid || sessionUser?.uid || "";
  const [userRows, setUserRows] = useState([]);
  const [userRowsError, setUserRowsError] = useState("");
  const [userRowsLoading, setUserRowsLoading] = useState(false);
  const {
    envOptions,
    envNames,
    error: envCatalogError,
    loading: loadingEnvCatalog,
  } = useEnvironmentCatalog();
  const { isNewEnv, markEnvSeen } = useNewEnvironments(envNames);

  useEffect(() => {
    if (!envNames.length || envNames.includes(envName)) {
      return;
    }

    setEnvName(envNames[0]);
  }, [envName, envNames, setEnvName]);

  const resolvedEnvOptions =
    envOptions.length > 0 ? envOptions : [{ name: envName, label: envName }];
  const showEnvBadge = isNewEnv(envName);
  const envDocsLink = envName ? ROUTES.docsEnvironment(envName) : ROUTES.docs;

  const resolvedEvaluationId = rows[0]?.evaluationId || "";


  useEffect(() => {
    let active = true;

    const normalizeRows = (payload) => {
      if (Array.isArray(payload)) {
        return payload;
      }
      if (Array.isArray(payload?.rows)) {
        return payload.rows;
      }
      if (Array.isArray(payload?.results)) {
        return payload.results;
      }
      if (Array.isArray(payload?.data)) {
        return payload.data;
      }
      if (Array.isArray(payload?.data?.rows)) {
        return payload.data.rows;
      }
      return [];
    };

    const sortByRank = (items) =>
      [...items].sort((left, right) => {
        const leftRank = Number(left?.rank);
        const rightRank = Number(right?.rank);

        if (Number.isNaN(leftRank) && Number.isNaN(rightRank)) {
          return 0;
        }
        if (Number.isNaN(leftRank)) {
          return 1;
        }
        if (Number.isNaN(rightRank)) {
          return -1;
        }

        return leftRank - rightRank;
      });

    const loadUserRows = async () => {
      if (!isAuthenticated || !resolvedEvaluationId) {
        setUserRows([]);
        setUserRowsError("");
        setUserRowsLoading(false);
        return;
      }

      setUserRowsLoading(true);
      setUserRowsError("");

      try {
        const payload = await resultsApi.listMine({
          evaluationId: resolvedEvaluationId,
          envName,
          limit: 10,
          skip: 0,
        });
        const normalized = normalizeRows(payload);
        if (active) {
          const fallbackUsername =
            user?.displayName || sessionUser?.username || sessionUser?.email;
          const enriched = fallbackUsername
            ? normalized.map((row) => ({
                ...row,
                displayName: row.displayName || fallbackUsername,
                username: row.username || fallbackUsername,
              }))
            : normalized;
          setUserRows(sortByRank(enriched));
        }
      } catch (apiError) {
        if (active) {
          setUserRows([]);
          setUserRowsError(
            apiError?.message || "Unable to load your leaderboard result.",
          );
        }
      } finally {
        if (active) {
          setUserRowsLoading(false);
        }
      }
    };

    loadUserRows();

    return () => {
      active = false;
    };
  }, [envName, isAuthenticated, resolvedEvaluationId, sessionUser, user]);

  return (
    <PageShell
      title="Leaderboard"
      subtitle="See ranked aggregate performance across strategies for an environment and evaluation."
    >
      <LeaderboardToolbar
        envOptions={resolvedEnvOptions}
        envName={envName}
        onEnvChange={setEnvName}
        showEnvBadge={showEnvBadge}
      />

      {showEnvBadge ? (
        <div className="info-box env-callout">
          <div>
            <h2>New environment available: {envName}</h2>
            <p>Check the docs and see how strategies are being evaluated.</p>
          </div>
          <div className="env-callout-actions">
            <button
              className="secondary-btn"
              type="button"
              onClick={() => markEnvSeen(envName)}
            >
              Got it
            </button>
            <button
              className="secondary-btn"
              type="button"
              onClick={() => navigate(envDocsLink)}
            >
              View docs
            </button>
          </div>
        </div>
      ) : null}

      <NextStepsPanel
        subtitle="Compare performance, then iterate on your next run."
        actions={[
          {
            label: "Review your results",
            description: "See your latest runs and drill into evaluation rows.",
            to: ROUTES.app.results,
            cta: "My Results",
          },
          {
            label: "Create a strategy",
            description: "Ship a new idea and climb the rankings.",
            to: ROUTES.app.newStrategy,
            cta: "New Strategy",
          },
          {
            label: `Read ${envName} docs`,
            description: "Understand scoring, inputs, and constraints.",
            to: envDocsLink,
            cta: "Open Docs",
          },
        ]}
      />

      {envCatalogError ? (
        <ErrorState
          title="Unable to load environments"
          message={envCatalogError}
          compact
        />
      ) : null}

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
          message={`No completed leaderboard rows found for ${envName}.`}
          compact
        />
      ) : (
        <LeaderboardTable
          rows={rows}
          evaluationId={resolvedEvaluationId}
          showPodium
          currentUserId={currentUserId}
          pinnedRows={userRows}
        />
      )}

      {userRowsLoading ? (
        <LoadingState message="Loading your result..." compact />
      ) : userRowsError ? (
        <ErrorState
          title="Unable to load your result"
          message={userRowsError}
          compact
        />
      ) : userRows.length > 0 ? (
        <LeaderboardTable
          rows={userRows}
          contextLabel="Your Result"
          highlightTopRanks
          currentUserId={currentUserId}
        />
      ) : null}
    </PageShell>
  );
}

export default Leaderboard;
