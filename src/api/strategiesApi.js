import { apiClient } from "../lib/apiClient";

const BASE_PATH = "/api/strategies";

export const strategiesApi = {
  list({ envName, active } = {}) {
    const query = { envName };
    if (active !== undefined && active !== null && active !== "") {
      query.active = active;
    }
    return apiClient.get(BASE_PATH, { query });
  },

  getById(strategyId) {
    return apiClient.get(`${BASE_PATH}/${strategyId}`);
  },

  create(payload) {
    return apiClient.post(BASE_PATH, payload);
  },

  update(strategyId, payload) {
    return apiClient.patch(`${BASE_PATH}/${strategyId}`, payload);
  },

  remove(strategyId) {
    return apiClient.delete(`${BASE_PATH}/${strategyId}`);
  },

  setActive(strategyId, envName) {
    const payload = envName ? { isActive: true, envName } : { isActive: true };
    return apiClient.patch(`${BASE_PATH}/${strategyId}`, payload);
  },
};
