import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import NextStepsPanel from "../components/NextStepsPanel";
import PageShell from "../components/PageShell";
import StrategiesToolbar from "../components/strategies/StrategiesToolbar";
import StrategiesTable from "../components/strategies/StrategiesTable";
import useNewEnvironments from "../hooks/useNewEnvironments";
import useStrategies, { STRATEGY_ACTIVE_FILTERS } from "../hooks/useStrategies";
import useEnvironmentCatalog from "../hooks/useEnvironmentCatalog";
import { ROUTES } from "../lib/routes";

function Strategies() {
  const navigate = useNavigate();
  const {
    envName,
    setEnvName,
    activeFilter,
    setActiveFilter,
    strategies,
    loading,
    error,
    activatingId,
    deletingId,
    fetchStrategies,
    handleSetActive,
    handleDelete,
  } = useStrategies();
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

  return (
    <PageShell
      title="Strategies"
      subtitle="List, create, edit, delete, and set your active strategy per environment."
    >
      <StrategiesToolbar
        envOptions={resolvedEnvOptions}
        envName={envName}
        onEnvChange={setEnvName}
        showEnvBadge={showEnvBadge}
        activeFilters={STRATEGY_ACTIVE_FILTERS}
        activeFilter={activeFilter}
        onActiveFilterChange={setActiveFilter}
        onRefresh={fetchStrategies}
        loading={loading}
        onNewStrategy={() => navigate(ROUTES.app.newStrategy)}
      />

      {showEnvBadge ? (
        <div className="info-box env-callout">
          <div>
            <h2>New environment available: {envName}</h2>
            <p>
              Explore the docs and set up your first strategy for this
              environment.
            </p>
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
        subtitle="Move from idea to evaluation in a few quick steps."
        actions={[
          {
            label: "Create a strategy",
            description: "Draft or import your next approach for this env.",
            to: ROUTES.app.newStrategy,
            cta: "New Strategy",
          },
          {
            label: "Check the leaderboard",
            description: "See what’s working and benchmark your results.",
            to: ROUTES.app.leaderboard,
            cta: "View Leaderboard",
          },
          {
            label: `Read ${envName} docs`,
            description: "Review rules, inputs, and scoring details.",
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
          title="Unable to load strategies"
          message={error}
          actionLabel="Try Again"
          onAction={fetchStrategies}
          compact
        />
      ) : null}

      {loading || loadingEnvCatalog ? (
        <LoadingState message="Loading strategies..." compact />
      ) : strategies.length === 0 ? (
        <EmptyState
          title="No strategies found"
          message={`No strategies match ${envName}. Try changing environment or create a new strategy.`}
          actionLabel="Create strategy"
          onAction={() => navigate(ROUTES.app.newStrategy)}
          compact
        />
      ) : (
        <StrategiesTable
          strategies={strategies}
          envName={envName}
          activatingId={activatingId}
          deletingId={deletingId}
          onSetActive={handleSetActive}
          onEdit={(strategyId) => navigate(ROUTES.app.strategyById(strategyId))}
          onDelete={handleDelete}
        />
      )}
    </PageShell>
  );
}

export default Strategies;
