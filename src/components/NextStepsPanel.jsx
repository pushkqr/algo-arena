import { Link } from "react-router-dom";

function NextStepsPanel({ title = "What's next", subtitle, actions = [] }) {
  if (!actions.length) {
    return null;
  }

  return (
    <section className="next-steps">
      <div className="next-steps-header">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className="next-steps-actions">
        {actions.map((action) => (
          <div className="next-steps-card" key={action.label}>
            <div>
              <p className="next-steps-title">{action.label}</p>
              {action.description ? (
                <p className="next-steps-desc">{action.description}</p>
              ) : null}
            </div>
            {action.to ? (
              <Link className="secondary-btn" to={action.to}>
                {action.cta || "Go"}
              </Link>
            ) : (
              <button
                className="secondary-btn"
                type="button"
                onClick={action.onClick}
              >
                {action.cta || "Go"}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default NextStepsPanel;
