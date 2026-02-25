import { Link } from "react-router-dom";
import { hasFirebaseConfig } from "../lib/firebase";
import useAuthState from "../hooks/useAuthState";
import useAuthRedirect from "../hooks/useAuthRedirect";
import useSignUpFlow from "../hooks/useSignUpFlow";
import HeroShell from "../components/HeroShell";
import { ROUTES } from "../lib/routes";

function SignUp() {
  const { isAuthenticated, user } = useAuthState();
  const {
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
  } = useSignUpFlow({
    isAuthenticated,
    user,
  });

  const { navigateToNextPath } = useAuthRedirect({
    isAuthenticated,
    loading,
    blockRedirect: usernameClaimRequired,
  });

  async function handleSignUpSubmit() {
    const completed = await handleSignUp();
    if (completed) {
      navigateToNextPath();
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
                setError("");
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
                disabled={loading || !hasFirebaseConfig || !canCreateAccount}
                onClick={handleSignUpSubmit}
              >
                {loading
                  ? "Please wait..."
                  : usernameClaimRequired
                    ? "Complete Username Setup"
                    : "Sign Up"}
              </button>
            </div>

            {usernameClaimRequired ? (
              <p className="signin-username-hint signin-username-hint--error">
                Your account exists, but username claim is pending. Retry to
                complete setup.
              </p>
            ) : null}

            <p className="signin-switch-text">
              Already have an account?{" "}
              <Link to={ROUTES.login} className="signin-switch-link">
                Log in
              </Link>
            </p>

            {error && <p className="auth-error">{error}</p>}
          </div>
        </div>
      </div>
    </HeroShell>
  );
}

export default SignUp;
