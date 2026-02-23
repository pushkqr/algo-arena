import { apiClient } from "../lib/apiClient";

const BASE_PATH = "/api/leaderboard/evaluations";

export const leaderboardApi = {
  listEvaluations({ envName, evaluationId, limit, skip } = {}) {
    return apiClient.get(BASE_PATH, {
      query: {
        envName,
        evaluationId,
        limit,
        skip,
      },
    });
  },
};
