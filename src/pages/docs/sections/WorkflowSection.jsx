function WorkflowSection() {
  return (
    <section id="workflow" className="info-box docs-section">
      <h2>Recommended Workflow</h2>
      <p>
        Use this loop to avoid blind submits and keep strategy iteration
        predictable.
      </p>
      <ol className="feature-list">
        <li>Write or update your strategy source.</li>
        <li>
          Run <strong>Verify Code</strong> and resolve all errors.
        </li>
        <li>
          Run <strong>Run</strong> (enabled only for verified, unchanged source)
          to test behavior quickly.
        </li>
        <li>
          Review sandbox output and metadata assumptions, then save when ready.
        </li>
      </ol>
    </section>
  );
}

export default WorkflowSection;
