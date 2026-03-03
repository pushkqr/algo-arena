import PageShell from "../components/PageShell";

function Contact() {
  return (
    <PageShell
      title="Contact"
      subtitle="Support hub for account, strategy, verification, run, and leaderboard issues."
    >
      <div className="grid-two">
        <section className="info-box">
          <h2>How to Reach Support</h2>
          <p>
            If something is broken or unclear, email support and include enough
            detail for quick reproduction.
          </p>
          <ul className="feature-list">
            <li>
              <strong>Email:</strong>{" "}
              <a
                className="docs-inline-link"
                href="mailto:support@algoarena.dev"
              >
                support@algoarena.dev
              </a>
            </li>
            <li>
              <strong>Scope:</strong> sign-in issues, strategy editor behavior,
              verification failures, sandbox run issues, results/leaderboard
              anomalies.
            </li>
            <li>
              <strong>Typical response:</strong> within 1-2 business days.
            </li>
            <li>
              <strong>Urgent/security:</strong> include
              <strong> SECURITY</strong> in the subject and avoid sharing
              private credentials.
            </li>
          </ul>
        </section>

        <section className="info-box">
          <h2>Issue Report Checklist</h2>
          <p>Use this format to reduce back-and-forth and speed up triage.</p>
          <ul className="feature-list">
            <li>
              <strong>Where:</strong> page/route where issue occurred.
            </li>
            <li>
              <strong>Action:</strong> what you clicked/typed right before the
              issue.
            </li>
            <li>
              <strong>Expected vs actual:</strong> what you expected and what
              happened instead.
            </li>
            <li>
              <strong>Environment:</strong> browser + device type, plus env name
              when relevant (for example AuctionHouse).
            </li>
            <li>
              <strong>Artifacts:</strong> screenshot, exact error text, and
              timestamp.
            </li>
            <li>
              <strong>Repro steps:</strong> numbered steps if the issue is
              repeatable.
            </li>
          </ul>
        </section>
      </div>

      <section className="info-box docs-section">
        <h2>Before You Contact Us</h2>
        <ul className="feature-list">
          <li>Refresh once and retry the action.</li>
          <li>Re-run Verify if source was edited before Run.</li>
          <li>Confirm metadata is valid JSON if save/run fails.</li>
          <li>
            Check Strategy Docs for environment contract details and known
            verification patterns.
          </li>
        </ul>
      </section>
    </PageShell>
  );
}

export default Contact;
