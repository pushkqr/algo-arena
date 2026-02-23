import { useEffect, useState } from "react";

export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export function normalizeUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export default function useUsernameAvailability({
  enabled,
  candidate,
  currentValue,
  checkAvailability,
}) {
  const [usernameCheck, setUsernameCheck] = useState({
    status: "idle",
    message: "",
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const normalizedCandidate = normalizeUsername(candidate);
    const normalizedCurrent = normalizeUsername(currentValue);

    if (!normalizedCandidate) {
      setUsernameCheck({
        status: "idle",
        message: "Use 3-20 chars: lowercase letters, numbers, underscore.",
      });
      return;
    }

    if (!USERNAME_PATTERN.test(normalizedCandidate)) {
      setUsernameCheck({
        status: "invalid",
        message:
          "Username must be 3-20 chars and only lowercase letters, numbers, underscore.",
      });
      return;
    }

    if (normalizedCandidate === normalizedCurrent) {
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
        const availability = await checkAvailability(normalizedCandidate);
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
  }, [enabled, candidate, currentValue, checkAvailability]);

  function resetUsernameCheck() {
    setUsernameCheck({ status: "idle", message: "" });
  }

  return {
    usernameCheck,
    setUsernameCheck,
    resetUsernameCheck,
  };
}
