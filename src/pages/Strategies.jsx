import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import PageShell from "../components/PageShell";
import StrategiesToolbar from "../components/strategies/StrategiesToolbar";
import StrategiesTable from "../components/strategies/StrategiesTable";
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

  useEffect(() => {
    if (!envNames.length || envNames.includes(envName)) {
      return;
    }

    setEnvName(envNames[0]);
  }, [envName, envNames, setEnvName]);

  const resolvedEnvOptions =
    envOptions.length > 0 ? envOptions : [{ name: envName, label: envName }];

  return (
    <PageShell
      title="Strategies"
      subtitle="List, create, edit, delete, and set your active strategy per environment."
    >
      <StrategiesToolbar
        envOptions={resolvedEnvOptions}
        envName={envName}
        onEnvChange={setEnvName}
        activeFilters={STRATEGY_ACTIVE_FILTERS}
        activeFilter={activeFilter}
        onActiveFilterChange={setActiveFilter}
        onRefresh={fetchStrategies}
        loading={loading}
        onNewStrategy={() => navigate(ROUTES.app.newStrategy)}
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
          message="No strategies match this filter. Try changing environment or status."
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
