import { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, hasFirebaseConfig } from "../lib/firebase";
import useAuthState from "../hooks/useAuthState";
import useAuthRedirect from "../hooks/useAuthRedirect";
import HeroShell from "../components/HeroShell";
import { ROUTES } from "../lib/routes";
import { toast } from "react-toastify";

function SignIn() {
  const { isAuthenticated } = useAuthState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { navigateToNextPath } = useAuthRedirect({
    isAuthenticated,
    loading,
  });

  async function handleSignIn() {
    if (!auth) {
      toast.error("Firebase is not configured. Add VITE_FIREBASE_* values.");
      return;
    }

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast.success("Logged in successfully.");
      navigateToNextPath();
    } catch (authError) {
      toast.error(authError?.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <HeroShell shellClassName="signin-shell" contentClassName="signin-content">
      <div className="signin-layout">
        <div className="signin-copy">
          <p className="landing-kicker">ACCOUNT ACCESS</p>

          <h1 className="landing-title signin-title">
            Log in.
            <br />
            <span>Continue evaluating and iterating.</span>
          </h1>
        </div>

        <div className="signin-card">
          <p className="signin-helper">
            Use your account credentials to sign in.
          </p>

          {!hasFirebaseConfig && (
            <p className="auth-error">
              Firebase config missing. Create `.env.local` from `.env.example`.
            </p>
          )}

          <div className="auth-panel">
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
              autoComplete="current-password"
            />

            <div className="auth-actions">
              <button
                disabled={loading || !hasFirebaseConfig}
                onClick={handleSignIn}
              >
                {loading ? "Please wait..." : "Sign In"}
              </button>
            </div>

            <p className="signin-switch-text">
              Don&apos;t have an account?{" "}
              <Link to={ROUTES.signup} className="signin-switch-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </HeroShell>
  );
}

export default SignIn;
