const TOKEN_KEY = "aa_token";
const ROLE_KEY = "aa_is_service_user";
const UID_KEY = "aa_uid";
const EMAIL_KEY = "aa_email";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function isServiceUser() {
  return localStorage.getItem(ROLE_KEY) === "true";
}

export function setServiceUser(value) {
  localStorage.setItem(ROLE_KEY, value ? "true" : "false");
}

export function getSessionUser() {
  return {
    uid: localStorage.getItem(UID_KEY) || "",
    email: localStorage.getItem(EMAIL_KEY) || "",
  };
}

export async function syncSessionFromUser(user) {
  if (!user) {
    clearSession();
    return;
  }

  const [token, tokenResult] = await Promise.all([
    user.getIdToken(),
    user.getIdTokenResult(),
  ]);

  const claims = tokenResult?.claims || {};
  const hasServiceRole = Boolean(
    claims?.isServiceUser ||
    claims?.serviceUser ||
    claims?.service ||
    claims?.role === "service",
  );

  setToken(token);
  setServiceUser(hasServiceRole);

  localStorage.setItem(UID_KEY, user.uid || "");
  localStorage.setItem(EMAIL_KEY, user.email || "");
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(UID_KEY);
  localStorage.removeItem(EMAIL_KEY);
}
