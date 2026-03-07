function MetadataSection() {
  return (
    <section id="metadata" className="info-box docs-section">
      <h2>Metadata (JSON)</h2>
      <p>
        Metadata stores extra structured config for your strategy (notes, tuning
        values, tags, thresholds). It is optional but useful for organizing and
        versioning strategy behavior.
      </p>
      <pre className="docs-code">{`{
  "tags": ["baseline", "auctionhouse"],
  "riskLimit": 0.2,
  "notes": "Conservative variant for volatile rounds"
}`}</pre>
    </section>
  );
}

export default MetadataSection;
