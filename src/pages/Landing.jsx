import { NavLink } from "react-router-dom";
import HeroShell from "../components/HeroShell";
import { ROUTES } from "../lib/routes";

function Landing() {
  return (
    <HeroShell>
      <p className="landing-kicker">ALGO ARENA</p>

      <h1 className="landing-title">
        Build better strategies.
        <br />
        <span>Compete with real evaluations.</span>
      </h1>

      <p className="landing-subtitle">
        Write algorithms, activate one strategy per environment, and compare
        outcomes with asynchronous ranking and aggregate metrics.
      </p>

      <div className="landing-actions">
        <NavLink to={ROUTES.login} className="landing-btn primary">
          Get Started
        </NavLink>
        <NavLink to={ROUTES.app.leaderboard} className="landing-btn ghost">
          View Leaderboard
        </NavLink>
      </div>

      <div className="landing-stats">
        <article className="stat-item">
          <h3>Single Active Strategy</h3>
          <p>One active strategy per user and environment.</p>
        </article>
        <article className="stat-item">
          <h3>Async Evaluations</h3>
          <p>Runs are queued, processed, and ranked automatically.</p>
        </article>
        <article className="stat-item">
          <h3>User-Scoped Results</h3>
          <p>Users see and manage only their own strategies and outcomes.</p>
        </article>
      </div>
    </HeroShell>
  );
}

export default Landing;
