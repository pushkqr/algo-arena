function VerificationSection() {
  return (
    <section id="verification" className="info-box docs-section">
      <h2>Verification Guide</h2>
      <p>
        Verify checks are there to catch unsafe or invalid code before save. You
        must export a default strategy implementation containing
        <strong> reset</strong>, <strong>observe</strong>, and
        <strong> act</strong>.
      </p>
      <ul className="feature-list">
        <li>Errors block save; warnings are guidance.</li>
        <li>
          The <strong>Run</strong> button is enabled only after a successful
          verify on the current, unchanged source.
        </li>
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
  );
}

export default VerificationSection;
