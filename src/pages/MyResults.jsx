import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import NextStepsPanel from "../components/NextStepsPanel";
import PageShell from "../components/PageShell";
import MyResultsTable from "../components/results/MyResultsTable";
import MyResultsToolbar from "../components/results/MyResultsToolbar";
import useEnvironmentCatalog from "../hooks/useEnvironmentCatalog";
import useMyResults from "../hooks/useMyResults";
import { ROUTES } from "../lib/routes";

function MyResults() {
  const navigate = useNavigate();
  const {
    evaluationIdInput,
    setEvaluationIdInput,
    envFilter,
    setEnvFilter,
    selectedEvaluationId,
    results,
    loading,
    error,
    prefillUnavailable,
    selectedEnvName,
    showingEvaluationResults,
    handleLoadResults,
  } = useMyResults();
  const {
    envOptions,
    envNames,
    error: envCatalogError,
    loading: loadingEnvCatalog,
  } = useEnvironmentCatalog();

  useEffect(() => {
    if (envFilter === "all") {
      return;
    }
    if (!envNames.length || envNames.includes(envFilter)) {
      return;
    }

    setEnvFilter("all");
  }, [envFilter, envNames, setEnvFilter]);

  const resolvedEnvOptions =
    envOptions.length > 0
      ? envOptions
      : envFilter && envFilter !== "all"
        ? [{ name: envFilter, label: envFilter }]
        : [];

  const envFilters = [
    { value: "all", label: "All Environments" },
    ...resolvedEnvOptions.map((option) => ({
      value: option.name,
      label: option.label,
    })),
  ];
  const envDocsLink = selectedEnvName
    ? ROUTES.docsEnvironment(selectedEnvName)
    : ROUTES.docs;

  return (
    <PageShell
      title="My Results"
      subtitle="Recent rows are preloaded, or search a specific evaluation run by ID."
    >
      <MyResultsToolbar
        envFilters={envFilters}
        envFilter={envFilter}
        onEnvFilterChange={setEnvFilter}
        evaluationIdInput={evaluationIdInput}
        onEvaluationIdChange={setEvaluationIdInput}
        onLoadResults={handleLoadResults}
        loading={loading}
      />

      <NextStepsPanel
        subtitle="Turn recent runs into a stronger next submission."
        actions={[
          {
            label: "Create a strategy",
            description: "Refine your approach and submit a new idea.",
            to: ROUTES.app.newStrategy,
            cta: "New Strategy",
          },
          {
            label: "Check the leaderboard",
            description: "Benchmark your results against top performers.",
            to: ROUTES.app.leaderboard,
            cta: "View Leaderboard",
          },
          {
            label: selectedEnvName
              ? `Read ${selectedEnvName} docs`
              : "Explore environment docs",
            description: "Review scoring, inputs, and constraints.",
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
          title="Unable to load results"
          message={error}
          actionLabel="Try Again"
          onAction={handleLoadResults}
          compact
        />
      ) : null}

      {loading || loadingEnvCatalog ? (
        <LoadingState message="Loading evaluation results..." compact />
      ) : results.length === 0 ? (
        <EmptyState
          title={
            showingEvaluationResults ? "No result rows" : "No recent results"
          }
          message={
            showingEvaluationResults
              ? `No user-scoped result rows were found for evaluation ${selectedEvaluationId}.`
              : prefillUnavailable
                ? "Recent prefill endpoint is unavailable. Enter an evaluation ID to fetch specific results."
                : selectedEnvName
                  ? `No recent rows were found for ${selectedEnvName}. Enter an evaluation ID to load specific results.`
                  : "No recent rows were found for your account. Enter an evaluation ID to load specific results."
          }
          compact
        />
      ) : (
        <MyResultsTable
          results={results}
          selectedEvaluationId={selectedEvaluationId}
          onView={(resultId) => navigate(ROUTES.app.resultById(resultId))}
        />
      )}
    </PageShell>
  );
}

export default MyResults;
