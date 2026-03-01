import { updateProfile } from "firebase/auth";
import { usersApi } from "../api/usersApi";
import { ApiClientError } from "./apiClient";
import { syncSessionFromUser } from "./authSession";
import { auth } from "./firebase";

const LAST_CLAIMED_DISPLAYNAME_KEY = "aa_last_claimed_displayName";
const OAUTH_USERNAME_ATTEMPTS = 8;
const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

function normalizeUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function resolveClaimedUsername(result, fallbackUsername) {
  const candidate =
    result?.username || result?.displayName || result?.user?.displayName;
  return normalizeUsername(candidate || fallbackUsername);
}

function toUsernameBase(rawValue) {
  const value = String(rawValue || "")
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  const normalized = normalizeUsername(value).slice(0, 20);
  if (normalized.length >= 3) {
    return normalized;
  }

  return "player";
}

function randomSuffix() {
  return Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
}

function buildCandidate(base, suffix) {
  const suffixToken = `_${suffix}`;
  const maxBaseLength = 20 - suffixToken.length;
  return `${base.slice(0, maxBaseLength)}${suffixToken}`;
}

async function tryClaimUsername(candidate) {
  const availability = await usersApi.checkUsernameAvailability(candidate);
  if (!availability?.available && !availability?.ownedByRequester) {
    return null;
  }

  try {
    const result = await usersApi.updateMyUsername(candidate);
    return resolveClaimedUsername(result, candidate);
  } catch (error) {
    if (
      error instanceof ApiClientError &&
      [400, 409, 412].includes(error.status)
    ) {
      return null;
    }

    throw error;
  }
}

async function mirrorDisplayName(claimedUsername) {
  if (!auth?.currentUser || !claimedUsername) {
    return;
  }

  try {
    sessionStorage.setItem(LAST_CLAIMED_DISPLAYNAME_KEY, claimedUsername);
  } catch {
    /* ignore storage errors */
  }

  await updateProfile(auth.currentUser, { displayName: claimedUsername });
  if (auth.currentUser.reload) {
    await auth.currentUser.reload();
  }
  if (auth.currentUser.getIdToken) {
    await auth.currentUser.getIdToken(true);
  }
  await syncSessionFromUser(auth.currentUser);

  if (
    normalizeUsername(auth.currentUser.displayName || "") === claimedUsername
  ) {
    try {
      sessionStorage.removeItem(LAST_CLAIMED_DISPLAYNAME_KEY);
    } catch {
      /* ignore storage errors */
    }
  }
}

export async function ensureOAuthUsername(signedInUser, options = {}) {
  const { mode = "signup" } = options;
  const currentDisplayName = normalizeUsername(signedInUser?.displayName || "");

  const emailBase = String(signedInUser?.email || "").split("@")[0] || "";
  const base = toUsernameBase(
    signedInUser?.displayName || emailBase || "player",
  );
  const preferredCandidate = USERNAME_PATTERN.test(currentDisplayName)
    ? currentDisplayName
    : base;

  const preferredClaim = await tryClaimUsername(preferredCandidate);
  if (preferredClaim) {
    try {
      await mirrorDisplayName(preferredClaim);
    } catch {
      if (auth?.currentUser) {
        await syncSessionFromUser(auth.currentUser);
      }
    }

    return preferredClaim;
  }

  if (mode === "signin") {
    return "";
  }

  const candidates = [];

  for (let index = 0; index < OAUTH_USERNAME_ATTEMPTS; index += 1) {
    candidates.push(buildCandidate(base, randomSuffix()));
  }

  for (const candidate of candidates) {
    const claimedUsername = await tryClaimUsername(candidate);
    if (!claimedUsername) {
      continue;
    }

    try {
      await mirrorDisplayName(claimedUsername);
    } catch {
      if (auth?.currentUser) {
        await syncSessionFromUser(auth.currentUser);
      }
    }

    return claimedUsername;
  }

  return "";
}
