function StateBlock({
  tone = "default",
  title,
  message,
  actionLabel,
  onAction,
  compact = false,
}) {
  const classes = [
    "state-block",
    tone !== "default" ? `state-${tone}` : "",
    compact ? "state-compact" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} role="status" aria-live="polite">
      {title ? <h2 className="state-title">{title}</h2> : null}
      {message ? <p className="state-message">{message}</p> : null}
      {actionLabel && typeof onAction === "function" ? (
        <button className="secondary-btn" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}

function LoadingState({ message = "Loading...", compact = false }) {
  return <StateBlock title="Loading" message={message} compact={compact} />;
}

function EmptyState({
  title = "No data",
  message = "Nothing to show yet.",
  actionLabel,
  onAction,
  compact = false,
}) {
  return (
    <StateBlock
      tone="empty"
      title={title}
      message={message}
      actionLabel={actionLabel}
      onAction={onAction}
      compact={compact}
    />
  );
}

function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  actionLabel,
  onAction,
  compact = false,
}) {
  return (
    <StateBlock
      tone="error"
      title={title}
      message={message}
      actionLabel={actionLabel}
      onAction={onAction}
      compact={compact}
    />
  );
}

export { LoadingState, EmptyState, ErrorState };
