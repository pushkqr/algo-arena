import { apiClient } from "../lib/apiClient";

const BASE_PATH = "/api/evaluations";

export const evaluationsApi = {
  list({ limit, skip, status, envName } = {}) {
    return apiClient.get(BASE_PATH, {
      query: {
        limit,
        skip,
        status,
        envName,
      },
    });
  },

  getById(evaluationId) {
    return apiClient.get(`${BASE_PATH}/${evaluationId}`);
  },

  start({ envName, ...config } = {}) {
    return apiClient.post(BASE_PATH, config, {
      query: {
        envName,
      },
    });
  },
};
