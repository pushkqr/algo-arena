import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import PageShell from "../components/PageShell";
import { resultsApi } from "../api/resultsApi";
import { ApiClientError } from "../lib/apiClient";
import { ROUTES } from "../lib/routes";

function normalizeResultResponse(payload) {
  if (!payload) {
    return null;
  }

  if (payload.result && typeof payload.result === "object") {
    return payload.result;
  }

  if (payload.data && typeof payload.data === "object") {
    return payload.data;
  }

  return payload;
}

function ResultsDetail() {
  const navigate = useNavigate();
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const metrics = useMemo(() => result?.metrics || {}, [result]);

  const loadResult = useCallback(async () => {
    if (!resultId) {
      setError("Result ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = await resultsApi.getItemById(resultId);
      const normalized = normalizeResultResponse(payload);

      if (!normalized || typeof normalized !== "object") {
        setResult(null);
        setError("Result detail is unavailable.");
        return;
      }

      setResult(normalized);
    } catch (apiError) {
      if (apiError instanceof ApiClientError && apiError.status === 401) {
        navigate(ROUTES.login, { replace: true });
        return;
      }

      if (apiError instanceof ApiClientError && apiError.status === 404) {
        setResult(null);
        setError("");
        return;
      }

      setResult(null);
      setError(apiError?.message || "Failed to load result detail.");
    } finally {
      setLoading(false);
    }
  }, [navigate, resultId]);

  useEffect(() => {
    loadResult();
  }, [loadResult]);

  if (loading) {
    return (
      <PageShell
        title="Result Detail"
        subtitle={`Loading result ${resultId || "-"}.`}
      >
        <LoadingState message="Loading result detail..." compact />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Result Detail"
      subtitle={`Aggregated metrics for result ${resultId || "-"}.`}
    >
      <div className="toolbar-row">
        <button
          className="secondary-btn"
          type="button"
          onClick={() => navigate(ROUTES.app.results)}
        >
          Back to My Results
        </button>
      </div>

      {error ? (
        <ErrorState
          title="Unable to load result detail"
          message={error}
          actionLabel="Try Again"
          onAction={loadResult}
          compact
        />
      ) : null}

      {!error && !result ? (
        <EmptyState
          title="Result not found"
          message={`No result row was found for result ID ${resultId || "-"}.`}
          compact
        />
      ) : null}

      {result ? (
        <div className="table-wrap">
          <table className="strategy-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Result ID</td>
                <td>{result.resultId || result._id || "-"}</td>
              </tr>
              <tr>
                <td>Evaluation</td>
                <td>{result.evaluationId || "-"}</td>
              </tr>
              <tr>
                <td>Agent</td>
                <td>{result.agentId || "-"}</td>
              </tr>
              <tr>
                <td>Owner</td>
                <td>{result.agentOwnerId || "-"}</td>
              </tr>
              <tr>
                <td>Rank</td>
                <td>{result.rank ?? "-"}</td>
              </tr>
              <tr>
                <td>Total Return</td>
                <td>{result.totalReturn ?? metrics.totalReturn ?? "-"}</td>
              </tr>
              <tr>
                <td>Average Return</td>
                <td>{result.averageReturn ?? metrics.averageReturn ?? "-"}</td>
              </tr>
              <tr>
                <td>Fail Rate</td>
                <td>{result.failRate ?? metrics.failRate ?? "-"}</td>
              </tr>
              <tr>
                <td>Created At</td>
                <td>{result.createdAt || "-"}</td>
              </tr>
              <tr>
                <td>Updated At</td>
                <td>{result.updatedAt || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </PageShell>
  );
}

export default ResultsDetail;
