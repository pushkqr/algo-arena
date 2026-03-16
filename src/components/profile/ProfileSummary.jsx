import { useState } from "react";

function ProfileSummary({
  user,
  sessionUser,
  isEditingName,
  onCompleteUsernameSetup,
}) {
  function formatMemberSince(rawValue) {
    if (!rawValue) {
      return null;
    }

    const parsed = new Date(rawValue);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatTimestamp(rawValue) {
    if (!rawValue) {
      return "-";
    }

    const parsed = new Date(rawValue);
    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const hasUsername = Boolean(
    String(
      user.displayName ||
        sessionStorage?.getItem("aa_last_claimed_displayName") ||
        "",
    ).trim(),
  );
  const effectiveName = user.displayName || sessionUser.email || "User";
  const effectiveEmail = sessionUser.email || user.email || "Unknown email";
  const initials = effectiveName.trim().slice(0, 2).toUpperCase() || "U";
  const [avatarError, setAvatarError] = useState(false);
  const avatarUrl = user.photoURL || sessionUser.photoURL || "";
  const showAvatarImage = Boolean(avatarUrl && !avatarError);
  const memberSince = formatMemberSince(user?.metadata?.creationTime);
  const lastLogin = formatTimestamp(user?.metadata?.lastSignInTime);
  const verificationState = user.emailVerified ? "VERIFIED" : "PENDING";
  const usernameState = hasUsername ? "SET" : "MISSING";

  return (
    <section className="profile-summary-card" aria-label="Profile summary">
      <div className="profile-summary-head">
        <div className="profile-avatar" aria-hidden="true">
          {showAvatarImage ? (
            <img
              src={avatarUrl}
              alt=""
              className="profile-avatar-image"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setAvatarError(true)}
            />
          ) : (
            initials
          )}
        </div>
        <div>
          <p className="profile-eyebrow">Account</p>
          <h2 className="profile-name">{effectiveName}</h2>
          <p className="profile-email">{effectiveEmail}</p>
        </div>
      </div>

      <div className="profile-badges">
        <span
          className={
            user.emailVerified ? "profile-badge is-success" : "profile-badge"
          }
        >
          {user.emailVerified ? "Email verified" : "Email unverified"}
        </span>
        <span
          className={hasUsername ? "profile-badge is-success" : "profile-badge"}
        >
          {hasUsername ? "Username set" : "Username missing"}
        </span>
        {memberSince ? (
          <span className="profile-badge">Member since {memberSince}</span>
        ) : null}
      </div>

      <div className="profile-kpis" role="list" aria-label="Account status">
        <article className="profile-kpi" role="listitem">
          <p className="profile-kpi-label">Verification</p>
          <p className="profile-kpi-value">{verificationState}</p>
        </article>
        <article className="profile-kpi" role="listitem">
          <p className="profile-kpi-label">Username</p>
          <p className="profile-kpi-value">{usernameState}</p>
        </article>
        <article className="profile-kpi" role="listitem">
          <p className="profile-kpi-label">Last Login</p>
          <p className="profile-kpi-value">{lastLogin}</p>
        </article>
      </div>

      {!hasUsername ? (
        <div className="profile-username-alert profile-username-alert-strong">
          <p className="verify-fail">Username setup required</p>
          <p className="verify-meta profile-alert-meta">
            Complete your username to ensure consistent profile identity.
          </p>
          {!isEditingName ? (
            <button
              className="secondary-btn profile-alert-action"
              type="button"
              onClick={onCompleteUsernameSetup}
            >
              Complete Username Setup
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default ProfileSummary;
