function FaqSection() {
  return (
    <section id="faq" className="info-box docs-section">
      <h2>FAQ</h2>
      <details className="docs-env-details">
        <summary className="docs-env-summary">Why is Run disabled?</summary>
        <div className="docs-env-content">
          <p>
            Run is enabled only after a successful verification of the current
            source. Any source edit invalidates that verify state.
          </p>
        </div>
      </details>

      <details className="docs-env-details">
        <summary className="docs-env-summary">
          Why can verify pass but strategy still perform poorly?
        </summary>
        <div className="docs-env-content">
          <p>
            Verification checks safety and contract validity, not strategy
            quality. Use sandbox output to refine decision logic and budget
            control.
          </p>
        </div>
      </details>

      <details className="docs-env-details">
        <summary className="docs-env-summary">
          When should I use metadata?
        </summary>
        <div className="docs-env-content">
          <p>
            Use metadata for notes, tags, and tunable values that help you track
            strategy versions and intent across iterations.
          </p>
        </div>
      </details>
    </section>
  );
}

export default FaqSection;
