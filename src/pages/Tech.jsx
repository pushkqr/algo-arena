import { NavLink } from "react-router-dom";
import HeroShell from "../components/HeroShell";
import { ROUTES } from "../lib/routes";

function Tech() {
  return (
    <HeroShell shellClassName="tech-shell" contentClassName="tech-content">
      <p className="landing-kicker">TECH STACK</p>

      <h1 className="landing-title tech-title">
        Pragmatic architecture,
        <br />
        <span>built for fast iteration.</span>
      </h1>

      <p className="landing-subtitle tech-subtitle">
        Algo Arena uses a lightweight React frontend with Firebase auth,
        centralized API access, and backend-compatible strategy workflows. The
        stack is intentionally simple so product iteration stays fast.
      </p>

      <div className="landing-actions">
        <NavLink to={ROUTES.login} className="landing-btn primary">
          Get Started
        </NavLink>
        <NavLink to={ROUTES.about} className="landing-btn ghost">
          Read About
        </NavLink>
      </div>

      <div className="grid-two tech-grid">
        <article className="info-box">
          <h2>Frontend Layer</h2>
          <ul className="feature-list">
            <li>React + Vite for fast local iteration and builds</li>
            <li>React Router for public, app, and protected routes</li>
            <li>Shared visual system with reusable shell patterns</li>
            <li>Monaco editor integration for strategy authoring UX</li>
          </ul>
        </article>

        <article className="info-box">
          <h2>Backend Integration</h2>
          <ul className="feature-list">
            <li>Firebase ID token flow for authenticated API requests</li>
            <li>Centralized API client with uniform error handling</li>
            <li>Strategy APIs for create, update, delete, and activation</li>
            <li>Evaluation/result surfaces designed for async pipelines</li>
          </ul>
        </article>
      </div>

      <div className="landing-stats tech-stats">
        <article className="stat-item">
          <h3>Modular Verifier</h3>
          <p>AST-based checks enforce strategy safety and contract rules.</p>
        </article>
        <article className="stat-item">
          <h3>Token-Aware Client</h3>
          <p>Requests include session auth and normalize API failures.</p>
        </article>
        <article className="stat-item">
          <h3>MVP-First Design</h3>
          <p>Architecture favors velocity, clarity, and extensibility.</p>
        </article>
      </div>
    </HeroShell>
  );
}

export default Tech;
