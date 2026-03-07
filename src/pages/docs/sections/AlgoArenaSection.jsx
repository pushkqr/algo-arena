function AlgoArenaSection() {
  return (
    <section id="algo-arena" className="info-box docs-section">
      <h2>Algo Arena</h2>
      <p>
        Algo Arena is a strategy coding platform where you build JavaScript
        agents, verify safety and contract compliance, then evaluate performance
        across different environments.
      </p>

      <h3>What You Can Do</h3>
      <ul className="feature-list">
        <li>
          Create and edit strategies with a consistent lifecycle:
          <code> reset</code>, <code>observe</code>, and <code>act</code>.
        </li>
        <li>
          Run verification checks to catch syntax errors, missing methods, and
          unsafe patterns before save.
        </li>
        <li>Execute sandbox runs to inspect behavior and iterate quickly.</li>
        <li>Track outcomes through results and leaderboard pages.</li>
      </ul>

      <h3>Recommended Flow</h3>
      <ol className="feature-list">
        <li>Start with a baseline strategy in the editor.</li>
        <li>Verify until all blocking issues are resolved.</li>
        <li>Run sandbox evaluations and inspect outputs.</li>
        <li>Refine logic, metadata, and environment assumptions.</li>
        <li>Save and compare results against other strategies.</li>
      </ol>

      <h3>Documentation Structure</h3>
      <ul className="feature-list">
        <li>
          <strong>Guides:</strong> practical workflows and implementation
          guidance for writing better strategies.
        </li>
        <li>
          <strong>References:</strong> quick troubleshooting and interpretation
          material for verification and sandbox output.
        </li>
      </ul>
    </section>
  );
}

export default AlgoArenaSection;
