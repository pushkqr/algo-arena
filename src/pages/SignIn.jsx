import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, hasFirebaseConfig } from "../lib/firebase";
import useAuthState from "../hooks/useAuthState";
import HeroShell from "../components/HeroShell";
import { ROUTES } from "../lib/routes";

function SignIn() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nextPath = useMemo(
    () => location.state?.from || ROUTES.app.strategies,
    [location.state],
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate(nextPath, { replace: true });
    }
  }, [isAuthenticated, navigate, nextPath]);

  async function handleGoogleSignIn() {
    if (!auth) {
      setError("Firebase is not configured. Add VITE_FIREBASE_* values.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate(nextPath, { replace: true });
    } catch (authError) {
      setError(authError?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailAuth(mode) {
    if (!auth) {
      setError("Firebase is not configured. Add VITE_FIREBASE_* values.");
      return;
    }

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      navigate(nextPath, { replace: true });
    } catch (authError) {
      setError(authError?.message || "Email auth failed.");
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
            Sign in.
            <br />
            <span>Continue building and evaluating.</span>
          </h1>
        </div>

        <div className="signin-card">
          <p className="signin-helper">
            Use Google or email/password to access your strategy workspace.
          </p>

          {!hasFirebaseConfig && (
            <p className="auth-error">
              Firebase config missing. Create `.env.local` from `.env.example`.
            </p>
          )}

          <div className="auth-panel">
            <button
              disabled={loading || !hasFirebaseConfig}
              onClick={handleGoogleSignIn}
            >
              {loading ? "Please wait..." : "Continue with Google"}
            </button>

            <div className="auth-divider">or</div>

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
                onClick={() => handleEmailAuth("signin")}
              >
                Sign In
              </button>
              <button
                disabled={loading || !hasFirebaseConfig}
                onClick={() => handleEmailAuth("signup")}
              >
                Create Account
              </button>
            </div>

            {error && <p className="auth-error">{error}</p>}
          </div>
        </div>
      </div>
    </HeroShell>
  );
}

export default SignIn;
