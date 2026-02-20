import { useEffect, useRef } from "react";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import PageShell from "../components/PageShell";
import ServiceEvaluationToolbar from "../components/serviceEvaluation/ServiceEvaluationToolbar";
import ServiceEvaluationsTable from "../components/serviceEvaluation/ServiceEvaluationsTable";
import useServiceEvaluations, {
  SERVICE_ENV_OPTIONS,
} from "../hooks/useServiceEvaluations";

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function ServiceEvaluation() {
  const {
    envName,
    setEnvName,
    poolSizeInput,
    setPoolSizeInput,
    poolCountInput,
    setPoolCountInput,
    episodesInput,
    setEpisodesInput,
    shuffleInput,
    setShuffleInput,
    evaluations,
    loadingList,
    submitting,
    listError,
    submitError,
    submitMessage,
    envOptionParams,
    envOptionValues,
    loadingEnvOptions,
    envOptionsError,
    selectedEvaluationId,
    selectedEvaluation,
    loadingDetail,
    detailError,
    detailRows,
    handleEnvOptionChange,
    loadEvaluations,
    loadEvaluationDetail,
    handleInspectToggle,
    handleStartEvaluation,
  } = useServiceEvaluations();
  const detailSectionRef = useRef(null);

  useEffect(() => {
    const shouldScroll =
      Boolean(selectedEvaluationId) &&
      !loadingDetail &&
      (Boolean(selectedEvaluation) || Boolean(detailError));

    if (!shouldScroll) {
      return;
    }

    detailSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [detailError, loadingDetail, selectedEvaluation, selectedEvaluationId]);

  return (
    <PageShell
      title="Service Evaluations"
      subtitle="Trigger evaluation runs and monitor asynchronous execution status."
    >
      <ServiceEvaluationToolbar
        envOptions={SERVICE_ENV_OPTIONS}
        envName={envName}
        onEnvNameChange={setEnvName}
        poolSizeInput={poolSizeInput}
        onPoolSizeChange={setPoolSizeInput}
        poolCountInput={poolCountInput}
        onPoolCountChange={setPoolCountInput}
        episodesInput={episodesInput}
        onEpisodesChange={setEpisodesInput}
        shuffleInput={shuffleInput}
        onShuffleChange={setShuffleInput}
        submitting={submitting}
        onQueue={handleStartEvaluation}
        envOptionParams={envOptionParams}
        envOptionValues={envOptionValues}
        onEnvOptionChange={handleEnvOptionChange}
        loadingEnvOptions={loadingEnvOptions}
        loadingList={loadingList}
        onRefresh={loadEvaluations}
      />

      {envOptionsError ? (
        <ErrorState
          title="Unable to load environment options"
          message={envOptionsError}
          compact
        />
      ) : null}

      {submitError ? (
        <ErrorState
          title="Unable to queue evaluation"
          message={submitError}
          compact
        />
      ) : null}

      {submitMessage ? (
        <EmptyState title="Evaluation queued" message={submitMessage} compact />
      ) : null}

      {listError ? (
        <ErrorState
          title="Unable to load evaluations"
          message={listError}
          actionLabel="Try Again"
          onAction={loadEvaluations}
          compact
        />
      ) : null}

      {loadingList ? (
        <LoadingState message="Loading evaluations..." compact />
      ) : evaluations.length === 0 ? (
        <EmptyState
          title="No evaluations yet"
          message="Queue your first evaluation run to see status and run details here."
          compact
        />
      ) : (
        <ServiceEvaluationsTable
          evaluations={evaluations}
          loadingDetail={loadingDetail}
          selectedEvaluationId={selectedEvaluationId}
          selectedEvaluation={selectedEvaluation}
          detailError={detailError}
          onInspectToggle={handleInspectToggle}
        />
      )}

      {(loadingDetail || detailError || selectedEvaluation) && (
        <div ref={detailSectionRef}>
          {loadingDetail ? (
            <LoadingState message="Loading evaluation detail..." compact />
          ) : detailError ? (
            <ErrorState
              title="Unable to load evaluation detail"
              message={detailError}
              actionLabel="Try Again"
              onAction={() => loadEvaluationDetail(selectedEvaluationId)}
              compact
            />
          ) : selectedEvaluation ? (
            <div className="table-wrap">
              <table className="strategy-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {detailRows.map(([field, value]) => (
                    <tr key={field}>
                      <td>{field}</td>
                      <td>{formatValue(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      )}
    </PageShell>
  );
}

export default ServiceEvaluation;
