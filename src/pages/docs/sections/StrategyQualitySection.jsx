function StrategyQualitySection() {
  return (
    <section id="strategy-quality" className="info-box docs-section">
      <h2>Strategy Quality Checklist</h2>
      <ul className="feature-list">
        <li>
          <strong>Contract complete:</strong> default export includes
          <strong> reset</strong>, <strong>observe</strong>, and
          <strong> act</strong>.
        </li>
        <li>
          <strong>Verification clean:</strong> no blocking verify errors.
        </li>
        <li>
          <strong>Sandbox tested:</strong> latest run output reviewed and
          interpreted before save.
        </li>
        <li>
          <strong>Bounded decisions:</strong> numeric outputs clamped to safe
          ranges.
        </li>
        <li>
          <strong>Metadata updated:</strong> notes/tags reflect strategy
          behavior and intent.
        </li>
      </ul>
    </section>
  );
}

export default StrategyQualitySection;
