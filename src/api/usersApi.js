import { apiClient } from "../lib/apiClient";

const BASE_PATH = "/api/users";

export const usersApi = {
  checkUsernameAvailability(username) {
    return apiClient.get(`${BASE_PATH}/username-availability`, {
      query: { username },
    });
  },

  updateMyUsername(username) {
    return apiClient.put(`${BASE_PATH}/me/username`, { username });
  },
};
