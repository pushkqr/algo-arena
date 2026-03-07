function SandboxReadingSection() {
  return (
    <section id="sandbox-reading" className="info-box docs-section">
      <h2>How to Read Sandbox Output</h2>
      <ul className="feature-list">
        <li>
          Start with outcome summary fields first, then inspect round-level or
          diagnostic details.
        </li>
        <li>
          Look for signals of unstable behavior: extreme bids, abrupt budget
          drops, or repeated zero-action patterns.
        </li>
        <li>
          After each run, tweak one strategy assumption at a time for clearer
          causality.
        </li>
        <li>Re-run only after a fresh verify pass when source changes.</li>
      </ul>
    </section>
  );
}

export default SandboxReadingSection;
