function ProfileDetailsTable({
  rows,
  user,
  copiedField,
  isEditingName,
  nameDraft,
  usernameCheck,
  actionLoading,
  canSaveName,
  onNameDraftChange,
  onSaveName,
  onCancelEditName,
  onStartEditName,
  onVerifyEmail,
  onCopy,
}) {
  function getUsernameStatusClass() {
    if (usernameCheck.status === "available") {
      return "verify-ok";
    }

    if (
      usernameCheck.status === "invalid" ||
      usernameCheck.status === "taken" ||
      usernameCheck.status === "error"
    ) {
      return "verify-fail";
    }

    return "verify-meta";
  }

  function getActionContent(row) {
    if (row.label === "Display Name") {
      if (isEditingName) {
        return (
          <div className="action-row">
            <button
              className="secondary-btn"
              type="button"
              onClick={onSaveName}
              disabled={!canSaveName}
            >
              {actionLoading === "name" ? "Saving..." : "Save"}
            </button>
            <button
              className="secondary-btn"
              type="button"
              onClick={onCancelEditName}
              disabled={actionLoading === "name"}
            >
              Cancel
            </button>
          </div>
        );
      }

      return (
        <button className="secondary-btn" type="button" onClick={onStartEditName}>
          Edit Username
        </button>
      );
    }

    if (row.label === "Email Verified") {
      if (user.emailVerified) {
        return <span className="profile-inline-pill is-success">Verified</span>;
      }

      return (
        <button
          className="secondary-btn"
          type="button"
          onClick={onVerifyEmail}
          disabled={actionLoading === "verify"}
        >
          {actionLoading === "verify" ? "Sending..." : "Verify Email"}
        </button>
      );
    }

    if (row.copyable) {
      return (
        <button
          className="secondary-btn"
          type="button"
          onClick={() => onCopy(row.label, row.value)}
        >
          {copiedField === row.label ? "Copied" : "Copy"}
        </button>
      );
    }

    return <span className="profile-inline-pill">No action</span>;
  }

  return (
    <section className="profile-details-shell" aria-label="Profile details">
      <header className="profile-details-head">
        <h2>Identity details</h2>
        <p className="verify-meta">Copy key fields or manage your account actions.</p>
      </header>

      <div className="profile-details-grid">
        {rows.map((row) => (
          <article className="profile-detail-card" key={row.label}>
            <p className="profile-detail-label">{row.label}</p>
            <div className="profile-detail-value">
              {row.label === "Display Name" && isEditingName ? (
                <>
                  <input
                    className="auth-input"
                    type="text"
                    value={nameDraft}
                    onChange={(event) => onNameDraftChange(event.target.value)}
                    placeholder="username"
                    maxLength={20}
                  />
                  {usernameCheck.message ? (
                    <p className={getUsernameStatusClass()}>{usernameCheck.message}</p>
                  ) : null}
                </>
              ) : (
                <code className="profile-value-text">{row.value || "-"}</code>
              )}
            </div>
            <div className="profile-detail-action">{getActionContent(row)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProfileDetailsTable;
