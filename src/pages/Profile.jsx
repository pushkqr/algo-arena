import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";
import PageShell from "../components/PageShell";
import { EmptyState, LoadingState } from "../components/AsyncState";
import useAuthState from "../hooks/useAuthState";
import { usersApi } from "../api/usersApi";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

function formatDate(rawValue) {
  if (!rawValue) {
    return "-";
  }

  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) {
    return String(rawValue);
  }

  return date.toLocaleString();
}

function toRows({ user, sessionUser }) {
  return [
    {
      label: "UID",
      value: sessionUser?.uid || user?.uid || "-",
      copyable: Boolean(sessionUser?.uid || user?.uid),
    },
    {
      label: "Email",
      value: sessionUser?.email || user?.email || "-",
      copyable: Boolean(sessionUser?.email || user?.email),
    },
    {
      label: "Display Name",
      value: user?.displayName || "-",
      copyable: false,
    },
    {
      label: "Email Verified",
      value: user?.emailVerified ? "Yes" : "No",
      copyable: false,
    },
    {
      label: "Account Created",
      value: formatDate(user?.metadata?.creationTime),
      copyable: false,
    },
    {
      label: "Last Sign In",
      value: formatDate(user?.metadata?.lastSignInTime),
      copyable: false,
    },
  ];
}

function Profile() {
  const { user, loading, sessionUser, hasFirebaseConfig } = useAuthState();
  const [copiedField, setCopiedField] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [usernameCheck, setUsernameCheck] = useState({
    status: "idle",
    message: "",
  });

  const rows = toRows({ user, sessionUser });

  useEffect(() => {
    if (!isEditingName || !user) {
      return;
    }

    const candidate = nameDraft.trim().toLowerCase();
    const currentDisplayName = (user.displayName || "").trim().toLowerCase();

    if (!candidate) {
      setUsernameCheck({
        status: "idle",
        message: "Use 3-20 chars: lowercase letters, numbers, underscore.",
      });
      return;
    }

    if (!USERNAME_PATTERN.test(candidate)) {
      setUsernameCheck({
        status: "invalid",
        message:
          "Username must be 3-20 chars and only lowercase letters, numbers, underscore.",
      });
      return;
    }

    if (candidate === currentDisplayName) {
      setUsernameCheck({
        status: "current",
        message: "This is your current username.",
      });
      return;
    }

    setUsernameCheck({
      status: "checking",
      message: "Checking availability...",
    });

    let active = true;
    const timer = window.setTimeout(async () => {
      try {
        const availability =
          await usersApi.checkUsernameAvailability(candidate);
        if (!active) {
          return;
        }

        if (availability?.available || availability?.ownedByRequester) {
          setUsernameCheck({
            status: "available",
            message: "Username is available.",
          });
        } else {
          setUsernameCheck({ status: "taken", message: "Username is taken." });
        }
      } catch {
        if (!active) {
          return;
        }

        setUsernameCheck({
          status: "error",
          message: "Could not verify availability right now.",
        });
      }
    }, 350);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [isEditingName, nameDraft, user]);

  async function handleCopy(label, value) {
    if (!value || value === "-") {
      return;
    }

    try {
      await navigator.clipboard.writeText(String(value));
      setCopiedField(label);
      toast.success(`${label} copied.`);
      window.setTimeout(() => {
        setCopiedField((current) => (current === label ? "" : current));
      }, 1400);
    } catch {
      setCopiedField("");
      toast.error("Failed to copy value.");
    }
  }

  function handleStartEditName() {
    setNameDraft(user?.displayName || "");
    setUsernameCheck({ status: "idle", message: "" });
    setIsEditingName(true);
  }

  function handleCancelEditName() {
    setIsEditingName(false);
    setNameDraft("");
    setUsernameCheck({ status: "idle", message: "" });
  }

  async function handleSaveName() {
    if (!user) {
      return;
    }

    const normalizedCandidate = nameDraft.trim().toLowerCase();
    if (!normalizedCandidate) {
      toast.error("Username cannot be empty.");
      return;
    }

    if (!USERNAME_PATTERN.test(normalizedCandidate)) {
      toast.error(
        "Username must be 3-20 characters and use only lowercase letters, numbers, or underscore.",
      );
      return;
    }

    if (usernameCheck.status === "checking") {
      toast.info("Checking username availability. Please wait.");
      return;
    }

    if (usernameCheck.status === "taken") {
      toast.error("Username is already taken.");
      return;
    }

    const currentDisplayName = (user.displayName || "").trim().toLowerCase();
    if (currentDisplayName === normalizedCandidate) {
      setIsEditingName(false);
      setNameDraft("");
      return;
    }

    setActionLoading("name");

    try {
      const availability =
        await usersApi.checkUsernameAvailability(normalizedCandidate);

      if (!availability?.available && !availability?.ownedByRequester) {
        toast.error("Username is already taken.");
        return;
      }

      const result = await usersApi.updateMyUsername(normalizedCandidate);

      await user.reload();
      setIsEditingName(false);
      setNameDraft("");
      setUsernameCheck({ status: "idle", message: "" });

      if (result?.authProfileUpdated === false) {
        toast.success("Username updated. Profile sync is in progress.");
      } else {
        toast.success("Username updated.");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to update username.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleVerifyEmail() {
    if (!user || user.emailVerified) {
      return;
    }

    setActionLoading("verify");

    try {
      await sendEmailVerification(user);
      toast.success("Verification email sent.");
    } catch (error) {
      toast.error(error?.message || "Failed to send verification email.");
    } finally {
      setActionLoading("");
    }
  }

  return (
    <PageShell
      title="Profile"
      subtitle="Your account identity and session details."
    >
      {loading ? (
        <LoadingState message="Loading profile..." compact />
      ) : !hasFirebaseConfig ? (
        <EmptyState
          title="Firebase not configured"
          message="Profile details are unavailable until Firebase config is provided."
          compact
        />
      ) : !user ? (
        <EmptyState
          title="Profile unavailable"
          message="No authenticated user session is active."
          compact
        />
      ) : (
        <>
          <div className="verify-panel">
            <p className="verify-meta">
              Signed in as{" "}
              <strong>{user.displayName || sessionUser.email || "User"}</strong>
            </p>
            <p className="verify-meta">
              {user.emailVerified
                ? "Email is verified"
                : "Email is not verified"}
            </p>
          </div>

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
                              setNameDraft(event.target.value.toLowerCase())
                            }
                            placeholder="username"
                            maxLength={20}
                          />
                          {usernameCheck.message ? (
                            <p
                              className={
                                usernameCheck.status === "available"
                                  ? "verify-ok"
                                  : usernameCheck.status === "invalid" ||
                                      usernameCheck.status === "taken" ||
                                      usernameCheck.status === "error"
                                    ? "verify-fail"
                                    : "verify-meta"
                              }
                            >
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
                              onClick={handleSaveName}
                              disabled={
                                actionLoading === "name" ||
                                usernameCheck.status === "checking" ||
                                usernameCheck.status === "invalid" ||
                                usernameCheck.status === "taken"
                              }
                            >
                              {actionLoading === "name" ? "Saving..." : "Save"}
                            </button>
                            <button
                              className="secondary-btn"
                              type="button"
                              onClick={handleCancelEditName}
                              disabled={actionLoading === "name"}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="secondary-btn"
                            type="button"
                            onClick={handleStartEditName}
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
                            onClick={handleVerifyEmail}
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
                          onClick={() => handleCopy(row.label, row.value)}
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
        </>
      )}
    </PageShell>
  );
}

export default Profile;
