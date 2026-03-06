import { NavLink } from "react-router-dom";
import HeroShell from "../components/HeroShell";
import { ROUTES } from "../lib/routes";

function Landing() {
  return (
    <HeroShell>
      <section className="landing-hero-intro">
        <p className="landing-kicker">ALGO ARENA</p>

        <h1 className="landing-title">
          Build resilient strategies.
          <br />
          <span>From idea to verified results.</span>
        </h1>

        <p className="landing-subtitle">
          Design, verify, evaluate, and improve in one loop with reproducible
          benchmarks and clear feedback at every iteration.
        </p>

        <div className="landing-actions">
          <NavLink to={ROUTES.login} className="landing-btn primary">
            Get Started
          </NavLink>
          <NavLink to={ROUTES.app.leaderboard} className="landing-btn ghost">
            View Leaderboard
          </NavLink>
        </div>
      </section>
    </HeroShell>
  );
}

export default Landing;
