import { apiClient } from "../lib/apiClient";

const META_ENV_PATH = "/api/meta/environment";

export const metaApi = {
  listEnvironments({ name } = {}) {
    const query = name ? { name } : undefined;
    return apiClient.get(META_ENV_PATH, { query, skipAuth: true });
  },
};
