import { NavLink } from "react-router-dom";
import HeroShell from "../components/HeroShell";
import { ROUTES } from "../lib/routes";

function About() {
  return (
    <HeroShell shellClassName="about-shell" contentClassName="about-content">
      <p className="landing-kicker">ABOUT ALGO ARENA</p>

      <h1 className="landing-title about-title">
        Strategy iteration,
        <br />
        <span>built for measurable progress.</span>
      </h1>

      <p className="landing-subtitle about-subtitle">
        Algo Arena is a strategy iteration platform for writing, validating, and
        evaluating algorithmic approaches in competitive environments. Move from
        idea to data-backed outcome with a consistent workflow.
      </p>

      <div className="landing-actions">
        <NavLink to={ROUTES.login} className="landing-btn primary">
          Get Started
        </NavLink>
        <NavLink to={ROUTES.tech} className="landing-btn ghost">
          View Tech Stack
        </NavLink>
      </div>

      <div className="grid-two about-grid">
        <article className="info-box">
          <h2>What You Can Do</h2>
          <ul className="feature-list">
            <li>Create and manage strategies per environment</li>
            <li>Validate source code against safety and contract rules</li>
            <li>Activate one strategy at a time for fair comparisons</li>
            <li>Track outcomes through results and leaderboard views</li>
          </ul>
        </article>

        <article className="info-box">
          <h2>MVP Scope</h2>
          <p>
            The current MVP is focused on the AuctionHouse environment and core
            strategy lifecycle. It prioritizes backend-compatible workflows,
            reliable authentication, and a clean operator experience before
            expanding to multi-environment coverage.
          </p>
        </article>
      </div>

      <div className="landing-stats about-stats">
        <article className="stat-item">
          <h3>Contract-Checked Code</h3>
          <p>Verification enforces required reset, observe, and act flow.</p>
        </article>
        <article className="stat-item">
          <h3>Fair Strategy Activation</h3>
          <p>One active strategy per user and environment at any time.</p>
        </article>
        <article className="stat-item">
          <h3>Async Evaluation Pipeline</h3>
          <p>Runs are queued, processed, and surfaced through rankings.</p>
        </article>
      </div>
    </HeroShell>
  );
}

export default About;
