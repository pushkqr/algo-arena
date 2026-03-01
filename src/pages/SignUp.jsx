import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, hasFirebaseConfig } from "../lib/firebase";
import useAuthState from "../hooks/useAuthState";
import useAuthRedirect from "../hooks/useAuthRedirect";
import useSignUpFlow from "../hooks/useSignUpFlow";
import HeroShell from "../components/HeroShell";
import { ROUTES } from "../lib/routes";
import { toast } from "react-toastify";
import { ensureOAuthUsername } from "../lib/oauthUsername";

function SignUp() {
  const { isAuthenticated, user } = useAuthState();
  const [oauthLoading, setOauthLoading] = useState(false);
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    usernameCheck,
    canCreateAccount,
    usernameClaimRequired,
    handleSignUp,
  } = useSignUpFlow({
    isAuthenticated,
    user,
  });

  const { navigateToNextPath } = useAuthRedirect({
    isAuthenticated,
    loading: loading || oauthLoading,
    blockRedirect: usernameClaimRequired,
  });

  async function handleSignUpSubmit() {
    const completed = await handleSignUp();
    if (completed) {
      navigateToNextPath();
    }
  }

  async function handleGoogleSignUp() {
    if (!auth) {
      toast.error("Firebase is not configured. Add VITE_FIREBASE_* values.");
      return;
    }

    setOauthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const signedInUser = credential?.user || auth.currentUser;
      let claimedUsername = "";

      if (signedInUser) {
        claimedUsername = await ensureOAuthUsername(signedInUser, {
          mode: "signup",
        });
      }

      if (!claimedUsername) {
        toast.error(
          "Could not finalize a unique username yet. Please retry or set it from Profile.",
        );
        return;
      }

      toast.success("Account ready. Logged in successfully.");
      navigateToNextPath();
    } catch (authError) {
      toast.error(authError?.message || "Google sign up failed.");
    } finally {
      setOauthLoading(false);
    }
  }

  return (
    <HeroShell shellClassName="signin-shell" contentClassName="signin-content">
      <div className="signin-layout">
        <div className="signin-copy">
          <p className="landing-kicker">ACCOUNT ACCESS</p>

          <h1 className="landing-title signin-title">
            Sign up.
            <br />
            <span>Continue evaluating and improving.</span>
          </h1>
        </div>

        <div className="signin-card">
          <p className="signin-helper">Create your account to get started.</p>

          {!hasFirebaseConfig && (
            <p className="auth-error">
              Firebase config missing. Create `.env.local` from `.env.example`.
            </p>
          )}

          <div className="auth-panel">
            <label className="auth-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="auth-input"
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value.toLowerCase());
              }}
              placeholder="username"
              maxLength={20}
              autoComplete="username"
            />

            {username.trim() ? (
              <p
                className={
                  usernameCheck.status === "available"
                    ? "signin-username-hint signin-username-hint--ok"
                    : usernameCheck.status === "invalid" ||
                        usernameCheck.status === "taken" ||
                        usernameCheck.status === "error"
                      ? "signin-username-hint signin-username-hint--error"
                      : "signin-username-hint"
                }
              >
                {usernameCheck.message}
              </p>
            ) : (
              <p className="signin-username-hint">
                Use 3-20 chars: lowercase letters, numbers, underscore.
              </p>
            )}

            <label className="auth-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <label className="auth-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="auth-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <div className="auth-actions">
              <button
                disabled={
                  loading ||
                  oauthLoading ||
                  !hasFirebaseConfig ||
                  !canCreateAccount
                }
                onClick={handleSignUpSubmit}
              >
                {loading
                  ? "Please wait..."
                  : usernameClaimRequired
                    ? "Complete Username Setup"
                    : "Sign Up"}
              </button>
              <button
                className="secondary-btn"
                disabled={loading || oauthLoading || !hasFirebaseConfig}
                onClick={handleGoogleSignUp}
              >
                {oauthLoading ? "Please wait..." : "Sign Up with Google"}
              </button>
            </div>

            {usernameClaimRequired ? (
              <p className="signin-username-hint signin-username-hint--error">
                Your account exists, but username claim is pending. Please wait.
              </p>
            ) : null}

            <p className="signin-switch-text">
              Already have an account?{" "}
              <Link to={ROUTES.login} className="signin-switch-link">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </HeroShell>
  );
}

export default SignUp;
