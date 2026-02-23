import { useCallback, useMemo, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";
import { usersApi } from "../api/usersApi";
import useCopyFeedback from "./useCopyFeedback";
import useUsernameAvailability, {
  USERNAME_PATTERN,
  normalizeUsername,
} from "./useUsernameAvailability";

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

export default function useProfileState({ user, sessionUser }) {
  const { copiedField, copyField } = useCopyFeedback();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const checkUsernameAvailability = useCallback(
    (username) => usersApi.checkUsernameAvailability(username),
    [],
  );

  const { usernameCheck, resetUsernameCheck } = useUsernameAvailability({
    enabled: Boolean(isEditingName && user),
    candidate: nameDraft,
    currentValue: user?.displayName || "",
    checkAvailability: checkUsernameAvailability,
  });

  const rows = useMemo(
    () => toRows({ user, sessionUser }),
    [user, sessionUser],
  );

  function handleStartEditName() {
    setNameDraft(user?.displayName || "");
    resetUsernameCheck();
    setIsEditingName(true);
  }

  function handleCancelEditName() {
    setIsEditingName(false);
    setNameDraft("");
    resetUsernameCheck();
  }

  async function handleSaveName() {
    if (!user) {
      return;
    }

    const normalizedCandidate = normalizeUsername(nameDraft);
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

    const currentDisplayName = normalizeUsername(user.displayName || "");
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
      resetUsernameCheck();

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

  const canSaveName =
    actionLoading !== "name" &&
    usernameCheck.status !== "checking" &&
    usernameCheck.status !== "invalid" &&
    usernameCheck.status !== "taken";

  return {
    rows,
    copiedField,
    isEditingName,
    nameDraft,
    actionLoading,
    canSaveName,
    usernameCheck,
    setNameDraft,
    handleCopy: copyField,
    handleStartEditName,
    handleCancelEditName,
    handleSaveName,
    handleVerifyEmail,
  };
}
