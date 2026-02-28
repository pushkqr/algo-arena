import { auth } from "./firebase";
import { clearSession, getToken, setToken } from "./authSession";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === "function" ? handler : null;
}

export class ApiClientError extends Error {
  constructor(message, { status, data, url, method } = {}) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.data = data;
    this.url = url;
    this.method = method;
  }
}

function buildUrl(path, query) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = API_BASE_URL
    ? new URL(normalizedPath, API_BASE_URL)
    : new URL(normalizedPath, window.location.origin);

  if (query && typeof query === "object") {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }

  return API_BASE_URL ? url.toString() : `${url.pathname}${url.search}`;
}

async function resolveToken() {
  if (auth?.currentUser) {
    try {
      const freshToken = await auth.currentUser.getIdToken();
      setToken(freshToken);
      return freshToken;
    } catch {
      return getToken();
    }
  }

  return getToken();
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

async function request(path, options = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    query,
    signal,
    skipAuth = false,
  } = options;

  const url = buildUrl(path, query);
  const token = skipAuth ? "" : await resolveToken();

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  const requestInit = {
    method,
    headers: requestHeaders,
    signal,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined && body !== null) {
    requestHeaders["Content-Type"] = "application/json";
    requestInit.body = JSON.stringify(body);
  }

  const response = await fetch(url, requestInit);
  const data = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearSession();
      if (unauthorizedHandler) {
        unauthorizedHandler({ status: response.status, url, method });
      }
    }

    throw new ApiClientError(
      data?.error || response.statusText || "API request failed",
      {
        status: response.status,
        data,
        url,
        method,
      },
    );
  }

  return data;
}

export const apiClient = {
  request,
  get(path, options = {}) {
    return request(path, { ...options, method: "GET" });
  },
  post(path, body, options = {}) {
    return request(path, { ...options, method: "POST", body });
  },
  patch(path, body, options = {}) {
    return request(path, { ...options, method: "PATCH", body });
  },
  put(path, body, options = {}) {
    return request(path, { ...options, method: "PUT", body });
  },
  delete(path, options = {}) {
    return request(path, { ...options, method: "DELETE" });
  },
};
