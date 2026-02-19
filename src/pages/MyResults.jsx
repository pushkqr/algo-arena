import { useNavigate } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import PageShell from "../components/PageShell";
import MyResultsTable from "../components/results/MyResultsTable";
import MyResultsToolbar from "../components/results/MyResultsToolbar";
import useMyResults, { RESULTS_ENV_FILTERS } from "../hooks/useMyResults";
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

  return (
    <PageShell
      title="My Results"
      subtitle="Recent rows are preloaded, or search a specific evaluation run by ID."
    >
      <MyResultsToolbar
        envFilters={RESULTS_ENV_FILTERS}
        envFilter={envFilter}
        onEnvFilterChange={setEnvFilter}
        evaluationIdInput={evaluationIdInput}
        onEvaluationIdChange={setEvaluationIdInput}
        onLoadResults={handleLoadResults}
        loading={loading}
      />

      {error ? (
        <ErrorState
          title="Unable to load results"
          message={error}
          actionLabel="Try Again"
          onAction={handleLoadResults}
          compact
        />
      ) : null}

      {loading ? (
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
