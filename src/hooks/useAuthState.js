import { useEffect, useState } from "react";
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
  const [sessionUser, setSessionUser] = useState(() => getSessionUser());

  useEffect(() => {
    let active = true;

    if (!hasFirebaseConfig || !auth) {
      Promise.resolve().then(() => {
        if (!active) return;
        setUser(null);
        clearSession();
        setSessionUser(getSessionUser());
        setLoading(false);
      });
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
        setSessionUser(getSessionUser());
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
