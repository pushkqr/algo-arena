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
          <h3>Active Strategy Management</h3>
          <p>
            Activate your best algorithm for each environment and refine it as
            you learn.
          </p>
        </article>
        <article className="stat-item">
          <h3>Automated, Fair Evaluations</h3>
          <p>
            Every submission is processed asynchronously, ensuring unbiased
            ranking and feedback.
          </p>
        </article>
        <article className="stat-item">
          <h3>Personalized Results & Progress</h3>
          <p>
            Track your strategies, outcomes, and growth - your data is private
            and under your control.
          </p>
        </article>
      </div>
    </HeroShell>
  );
}

export default Landing;
