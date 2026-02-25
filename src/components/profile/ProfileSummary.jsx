function ProfileSummary({
  user,
  sessionUser,
  isEditingName,
  onCompleteUsernameSetup,
}) {
  const hasUsername = Boolean(String(user.displayName || "").trim());

  return (
    <div className="verify-panel">
      <p className="verify-meta">
        Signed in as{" "}
        <strong>{user.displayName || sessionUser.email || "User"}</strong>
      </p>
      <p className="verify-meta">
        {user.emailVerified ? "Email is verified" : "Email is not verified"}
      </p>

      {!hasUsername ? (
        <div className="profile-username-alert">
          <p className="verify-fail">Username setup required.</p>
          <p className="verify-meta">
            Complete your username to ensure consistent profile identity.
          </p>
          {!isEditingName ? (
            <button
              className="secondary-btn"
              type="button"
              onClick={onCompleteUsernameSetup}
            >
              Complete Username Setup
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default ProfileSummary;
