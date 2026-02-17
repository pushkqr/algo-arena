import { useEffect, useMemo, useState } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth, hasFirebaseConfig } from "../lib/firebase";
import {
  clearSession,
  getSessionUser,
  isServiceUser,
  syncSessionFromUser,
} from "../lib/authSession";

function useAuthState() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!hasFirebaseConfig || !auth) {
      setUser(null);
      clearSession();
      setLoading(false);
      return () => {
        active = false;
      };
    }

    const unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
      if (!active) {
        return;
      }

      setUser(nextUser || null);
      if (nextUser) {
        await syncSessionFromUser(nextUser);
      } else {
        clearSession();
      }
      if (active) {
        setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const sessionUser = useMemo(() => getSessionUser(), [user]);

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isService: isServiceUser(),
    sessionUser,
    hasFirebaseConfig,
  };
}

export default useAuthState;
