import { useCallback, useEffect, useMemo, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import useUsernameAvailability, {
  USERNAME_PATTERN,
  normalizeUsername,
} from "./useUsernameAvailability";
import { usersApi } from "../api/usersApi";

const PENDING_SIGNUP_USERNAME_KEY = "aa_pending_signup_username";

export default function useSignUpFlow({ isAuthenticated, user }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameClaimRequired, setUsernameClaimRequired] = useState(false);

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

    await usersApi.updateMyUsername(candidateUsername);
    sessionStorage.removeItem(PENDING_SIGNUP_USERNAME_KEY);
    setUsernameClaimRequired(false);
  }

  async function handleSignUp() {
    if (!auth) {
      setError("Firebase is not configured. Add VITE_FIREBASE_* values.");
      return;
    }

    if (!usernameClaimRequired && (!email || !password)) {
      setError("Email and password are required.");
      return;
    }

    const candidateUsername = normalizeUsername(username);

    if (!candidateUsername) {
      setError("Username is required to create an account.");
      return;
    }

    if (!USERNAME_PATTERN.test(candidateUsername)) {
      setError(
        "Username must be 3-20 characters and use lowercase letters, numbers, or underscore.",
      );
      return;
    }

    if (usernameCheck.status === "checking") {
      setError("Username availability is still being checked. Please wait.");
      return;
    }

    if (usernameCheck.status === "taken") {
      setError("Username is already taken.");
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

      await claimUsername(candidateUsername);
      return true;
    } catch (authError) {
      if (
        accountCreated ||
        usernameClaimRequired ||
        auth?.currentUser ||
        user
      ) {
        setUsernameClaimRequired(true);
        setError(
          authError?.message ||
            "Account created, but username setup is incomplete. Please retry.",
        );
      } else {
        setError(authError?.message || "Sign up failed.");
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
