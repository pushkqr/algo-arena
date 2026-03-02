import PageShell from "../components/PageShell";

function Docs() {
  return (
    <PageShell
      title="Strategy Docs"
      subtitle="User-facing guide for writing, verifying, and configuring strategies in Algo Arena."
    >
      <div className="docs-quick-nav" aria-label="Docs quick links">
        <a className="docs-chip" href="#strategy-basics">
          Strategy Basics
        </a>
        <a className="docs-chip" href="#verification">
          Verification
        </a>
        <a className="docs-chip" href="#metadata">
          Metadata
        </a>
        <a className="docs-chip" href="#environments">
          Environments
        </a>
      </div>

      <section id="strategy-basics" className="info-box docs-section">
        <h2>How Strategies Work</h2>
        <p>
          A strategy runs as a simple lifecycle: <strong>reset</strong> at the
          start of a run, <strong>observe</strong> for each incoming state
          update, then <strong>act</strong> to return your next decision.
        </p>
        <ul className="feature-list">
          <li>
            <strong>reset(context)</strong>: initialize or clear any internal
            state.
          </li>
          <li>
            <strong>observe(observation)</strong>: ingest incoming signals/data
            and update local strategy state.
          </li>
          <li>
            <strong>act(state)</strong>: compute and return your next
            decision/output expected by the environment.
          </li>
        </ul>
      </section>

      <section id="verification" className="info-box docs-section">
        <h2>Verification Guide</h2>
        <p>
          Verify checks are there to catch unsafe or invalid code before save.
          You must export a default strategy implementation containing
          <strong> reset</strong>, <strong>observe</strong>, and
          <strong> act</strong>.
        </p>
        <ul className="feature-list">
          <li>Errors block save; warnings are guidance.</li>
          <li>
            Common failures: missing default export, missing required method,
            empty <strong>act</strong>, syntax errors.
          </li>
          <li>
            Restricted runtime APIs are blocked for safety and deterministic
            execution.
          </li>
        </ul>
      </section>

      <section id="metadata" className="info-box docs-section">
        <h2>Metadata (JSON)</h2>
        <p>
          Metadata stores extra structured config for your strategy (notes,
          tuning values, tags, thresholds). It is optional but useful for
          organizing and versioning strategy behavior.
        </p>
        <pre className="docs-code">{`{
  "tags": ["baseline", "auctionhouse"],
  "riskLimit": 0.2,
  "notes": "Conservative variant for volatile rounds"
}`}</pre>
      </section>

      <section id="environments" className="info-box docs-section">
        <h2>Environments</h2>
        <p>
          Environment docs describe what <strong>act</strong> should return and
          any environment-specific input/output expectations.
        </p>

        <details id="environment-auctionhouse" className="docs-env-details">
          <summary className="docs-env-summary">AuctionHouse</summary>
          <div className="docs-env-content">
            <p>
              For AuctionHouse, <strong>act</strong> should return a numeric
              bid. Start simple: use the latest observation and clamp your bid
              to a safe range.
            </p>
            <pre className="docs-code">{`export default {
  reset(context) {
    return context;
  },
  observe(obs) {
    return obs;
  },
  act(obs) {
    return Math.max(0, Math.min(obs?.remainingBudget || 0, 5));
  }
};`}</pre>
          </div>
        </details>
      </section>
    </PageShell>
  );
}

export default Docs;
