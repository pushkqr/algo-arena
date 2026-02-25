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
        Algo Arena is a platform for iterating algorithmic strategies with
        rigorous validation and measurable outcomes. Move from idea to
        data-backed results using a repeatable, feedback-driven workflow.
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
            <li>
              Author strategies and run them in realistic, testable environments
            </li>
            <li>Validate code with built-in safety and contract checks</li>
            <li>
              Activate a single strategy to ensure fair, apples-to-apples
              comparisons
            </li>
            <li>
              Analyze results, trends, and leaderboards to guide iteration
            </li>
            <li>Share strategies and learn from community examples</li>
          </ul>
        </article>

        <article className="info-box">
          <h2>Vision & Goals</h2>
          <p>
            Our goal is to make strategy iteration intuitive, measurable, and
            community-driven. We focus on reproducible evaluations, clear
            feedback loops, and tools that accelerate learning and discovery
            across environments.
          </p>
        </article>
      </div>

      <div className="landing-stats about-stats">
        <article className="stat-item">
          <h3>Verified by Contract Checks</h3>
          <p>
            Static and runtime checks enforce the expected strategy lifecycle
            and guard rails.
          </p>
        </article>
        <article className="stat-item">
          <h3>Fair Activation</h3>
          <p>
            Single active strategy per environment preserves comparability and
            fairness.
          </p>
        </article>
        <article className="stat-item">
          <h3>Scalable Evaluation Pipeline</h3>
          <p>
            Asynchronous runs, reproducible scoring, and dependable
            leaderboards.
          </p>
        </article>
      </div>
    </HeroShell>
  );
}

export default About;
