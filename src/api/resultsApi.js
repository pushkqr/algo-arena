import { apiClient } from "../lib/apiClient";

const BASE_PATH = "/api/results";

export const resultsApi = {
  listMine({ envName, evaluationId, agentId, limit, skip } = {}) {
    return apiClient.get(BASE_PATH, {
      query: {
        envName,
        evaluationId,
        agentId,
        limit,
        skip,
      },
    });
  },

  listByEvaluation(evaluationId) {
    return apiClient.get(`${BASE_PATH}/${evaluationId}`);
  },

  getItemById(resultId) {
    return apiClient.get(`${BASE_PATH}/item/${resultId}`);
  },
};
