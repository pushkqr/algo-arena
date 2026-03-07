function StrategyBasicsSection() {
  return (
    <section id="strategy-basics" className="info-box docs-section">
      <h2>How Strategies Work</h2>
      <p>
        A strategy runs as a lifecycle: <strong>reset</strong> at run start,
        <strong> observe</strong> for incoming state updates, then
        <strong> act</strong> to return the next environment decision.
      </p>
      <ul className="feature-list">
        <li>
          <strong>reset(context)</strong>: initialize or clear any internal
          state for a fresh run.
        </li>
        <li>
          <strong>observe(observation)</strong>: ingest incoming signals/data
          and update local state.
        </li>
        <li>
          <strong>act(state)</strong>: compute and return your next
          decision/output expected by the selected environment contract.
        </li>
        <li>
          Export a <strong>default</strong> object containing all required
          lifecycle methods.
        </li>
      </ul>
    </section>
  );
}

export default StrategyBasicsSection;
