import DocsCodeBlock from "../DocsCodeBlock";

function MetadataSection() {
  return (
    <section id="metadata" className="info-box docs-section">
      <h2>Metadata (JSON)</h2>
      <p>
        Metadata stores extra structured config for your strategy (notes, tuning
        values, tags, thresholds). It is optional but useful for organizing and
        versioning strategy behavior.
      </p>
      <DocsCodeBlock label="metadata.json">{`{
  "tags": ["baseline", "auctionhouse"],
  "riskLimit": 0.2,
  "notes": "Conservative variant for volatile rounds"
}`}</DocsCodeBlock>
    </section>
  );
}

export default MetadataSection;
