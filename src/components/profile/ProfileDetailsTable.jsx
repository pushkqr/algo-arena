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
  console.log("🚀 ~ ProfileDetailsTable ~ user:", user);
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

  return (
    <div className="table-wrap">
      <table className="strategy-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>
                {row.label === "Display Name" && isEditingName ? (
                  <>
                    <input
                      className="auth-input"
                      type="text"
                      value={nameDraft}
                      onChange={(event) =>
                        onNameDraftChange(event.target.value)
                      }
                      placeholder="username"
                      maxLength={20}
                    />
                    {usernameCheck.message ? (
                      <p className={getUsernameStatusClass()}>
                        {usernameCheck.message}
                      </p>
                    ) : null}
                  </>
                ) : (
                  row.value || "-"
                )}
              </td>
              <td>
                {row.label === "Display Name" ? (
                  isEditingName ? (
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
                  ) : (
                    <button
                      className="secondary-btn"
                      type="button"
                      onClick={onStartEditName}
                    >
                      Edit Username
                    </button>
                  )
                ) : row.label === "Email Verified" ? (
                  user.emailVerified ? (
                    "Verified"
                  ) : (
                    <button
                      className="secondary-btn"
                      type="button"
                      onClick={onVerifyEmail}
                      disabled={actionLoading === "verify"}
                    >
                      {actionLoading === "verify"
                        ? "Sending..."
                        : "Verify Email"}
                    </button>
                  )
                ) : row.copyable ? (
                  <button
                    className="secondary-btn"
                    type="button"
                    onClick={() => onCopy(row.label, row.value)}
                  >
                    {copiedField === row.label ? "Copied" : "Copy"}
                  </button>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProfileDetailsTable;
