function ProfileSummary({ user, sessionUser }) {
  return (
    <div className="verify-panel">
      <p className="verify-meta">
        Signed in as{" "}
        <strong>{user.displayName || sessionUser.email || "User"}</strong>
      </p>
      <p className="verify-meta">
        {user.emailVerified ? "Email is verified" : "Email is not verified"}
      </p>
    </div>
  );
}

export default ProfileSummary;
