import { useCallback, useEffect, useMemo, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../lib/firebase";
import useUsernameAvailability, {
  USERNAME_PATTERN,
  normalizeUsername,
} from "./useUsernameAvailability";
import { usersApi } from "../api/usersApi";
import { syncSessionFromUser } from "../lib/authSession";

const PENDING_SIGNUP_USERNAME_KEY = "aa_pending_signup_username";
const LAST_CLAIMED_DISPLAYNAME_KEY = "aa_last_claimed_displayName";

function resolveClaimedUsername(result, fallbackUsername) {
  const candidate =
    result?.username || result?.displayName || result?.user?.displayName;
  return normalizeUsername(candidate || fallbackUsername);
}

export default function useSignUpFlow({ isAuthenticated, user }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameClaimRequired, setUsernameClaimRequired] = useState(false);

  const setErrorWithToast = useCallback((message) => {
    setError(message);
    if (message) {
      toast.error(message);
    }
  }, []);

  const checkSignupUsernameAvailability = useCallback(
    (candidate) => usersApi.checkUsernameAvailability(candidate),
    [],
  );

  const { usernameCheck } = useUsernameAvailability({
    enabled: Boolean(username.trim()),
    candidate: username,
    currentValue: "",
    checkAvailability: checkSignupUsernameAvailability,
  });

  const normalizedSignupUsername = useMemo(
    () => normalizeUsername(username),
    [username],
  );

  const canCreateAccount = useMemo(() => {
    if (!normalizedSignupUsername) {
      return false;
    }

    if (!USERNAME_PATTERN.test(normalizedSignupUsername)) {
      return false;
    }

    if (
      usernameCheck.status === "checking" ||
      usernameCheck.status === "taken" ||
      usernameCheck.status === "invalid"
    ) {
      return false;
    }

    return true;
  }, [normalizedSignupUsername, usernameCheck.status]);

  useEffect(() => {
    const pendingUsername =
      sessionStorage.getItem(PENDING_SIGNUP_USERNAME_KEY) || "";

    if (!isAuthenticated) {
      setUsernameClaimRequired(false);
      if (pendingUsername) {
        sessionStorage.removeItem(PENDING_SIGNUP_USERNAME_KEY);
      }
      return;
    }

    if (pendingUsername) {
      setUsernameClaimRequired(true);
      if (!username) {
        setUsername(pendingUsername);
      }
    }
  }, [isAuthenticated, username]);

  async function claimUsername(candidateUsername) {
    const availability =
      await usersApi.checkUsernameAvailability(candidateUsername);

    if (!availability?.available && !availability?.ownedByRequester) {
      throw new Error("Username is already taken.");
    }

    const result = await usersApi.updateMyUsername(candidateUsername);
    const claimedUsername = resolveClaimedUsername(result, candidateUsername);

    try {
      sessionStorage.setItem(LAST_CLAIMED_DISPLAYNAME_KEY, claimedUsername);
    } catch {
      /* ignore storage errors */
    }

    sessionStorage.removeItem(PENDING_SIGNUP_USERNAME_KEY);
    setUsernameClaimRequired(false);

    return claimedUsername;
  }

  async function mirrorFrontendDisplayName(claimedUsername) {
    if (!auth?.currentUser || !claimedUsername) {
      return;
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

  async function handleSignUp() {
    if (!auth) {
      setErrorWithToast(
        "Firebase is not configured. Add VITE_FIREBASE_* values.",
      );
      return;
    }

    if (!usernameClaimRequired && (!email || !password)) {
      setErrorWithToast("Email and password are required.");
      return;
    }

    const candidateUsername = normalizeUsername(username);

    if (!candidateUsername) {
      setErrorWithToast("Username is required to create an account.");
      return;
    }

    if (!USERNAME_PATTERN.test(candidateUsername)) {
      setErrorWithToast(
        "Username must be 3-20 characters and use lowercase letters, numbers, or underscore.",
      );
      return;
    }

    if (usernameCheck.status === "checking") {
      setErrorWithToast(
        "Username availability is still being checked. Please wait.",
      );
      return;
    }

    if (usernameCheck.status === "taken") {
      setErrorWithToast("Username is already taken.");
      return;
    }

    setError("");
    setLoading(true);

    let accountCreated = false;

    try {
      if (!usernameClaimRequired) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
        accountCreated = true;
        sessionStorage.setItem(PENDING_SIGNUP_USERNAME_KEY, candidateUsername);
      }

      const claimedUsername = await claimUsername(candidateUsername);

      try {
        await mirrorFrontendDisplayName(claimedUsername);
      } catch {
        if (auth.currentUser) {
          await syncSessionFromUser(auth.currentUser);
        }
      }

      return true;
    } catch (authError) {
      if (
        accountCreated ||
        usernameClaimRequired ||
        auth?.currentUser ||
        user
      ) {
        setUsernameClaimRequired(true);
        setErrorWithToast(
          authError?.message ||
            "Account created, but username setup is incomplete. Please retry.",
        );
      } else {
        setErrorWithToast(authError?.message || "Sign up failed.");
      }
    } finally {
      setLoading(false);
    }

    return false;
  }

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    setError,
    usernameCheck,
    canCreateAccount,
    usernameClaimRequired,
    handleSignUp,
  };
}
