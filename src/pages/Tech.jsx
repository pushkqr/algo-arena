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
        Algo Arena combines a focused frontend with dependable backend
        integrations to make iteration fast and observable. The stack is
        intentionally pragmatic to prioritize reliability, reproducibility, and
        developer velocity.
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
            <li>
              React + Vite for fast local iteration and predictable bundles
            </li>
            <li>React Router for composable public and protected routes</li>
            <li>Design system and shell components for consistent UX</li>
            <li>
              Monaco editor for an integrated strategy authoring experience
            </li>
          </ul>
        </article>

        <article className="info-box">
          <h2>Backend Integration</h2>
          <ul className="feature-list">
            <li>Firebase Auth for secure identity and session management</li>
            <li>
              Centralized API client with consistent error and retry handling
            </li>
            <li>
              Robust strategy APIs for lifecycle management and activation
            </li>
            <li>
              Evaluation and results designed around asynchronous, reproducible
              pipelines
            </li>
          </ul>
        </article>
      </div>

      <div className="landing-stats tech-stats">
        <article className="stat-item">
          <h3>Verified Strategies</h3>
          <p>
            Pluggable AST checks and runtime assertions ensure strategies meet
            safety and contract rules before execution.
          </p>
        </article>
        <article className="stat-item">
          <h3>Resilient Client</h3>
          <p>
            Token-aware requests, consistent error handling, and retry logic
            provide robust API interactions.
          </p>
        </article>
        <article className="stat-item">
          <h3>Observability &amp; Extensibility</h3>
          <p>
            Structured logs, metrics-friendly events, and a modular design that
            supports scaling, analytics, and future environments.
          </p>
        </article>
      </div>
    </HeroShell>
  );
}

export default Tech;
