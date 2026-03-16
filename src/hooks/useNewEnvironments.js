import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "aa_seen_envs";

function readSeenEnvSet() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(parsed.filter(Boolean));
  } catch {
    return new Set();
  }
}

function writeSeenEnvSet(envSet) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(envSet)));
  } catch {
    /* ignore storage errors */
  }
}

export default function useNewEnvironments(envNames = []) {
  const [newEnvNames, setNewEnvNames] = useState([]);

  useEffect(() => {
    if (!envNames.length) {
      setNewEnvNames([]);
      return;
    }

    const seen = readSeenEnvSet();
    if (seen.size === 0) {
      const initialSet = new Set(envNames);
      writeSeenEnvSet(initialSet);
      setNewEnvNames([]);
      return;
    }

    const newlyAdded = envNames.filter((name) => !seen.has(name));
    setNewEnvNames(newlyAdded);
  }, [envNames]);

  const markEnvSeen = (envName) => {
    if (!envName) {
      return;
    }
    const seen = readSeenEnvSet();
    seen.add(envName);
    writeSeenEnvSet(seen);
    setNewEnvNames((prev) => prev.filter((name) => name !== envName));
  };

  const newEnvSet = useMemo(() => new Set(newEnvNames), [newEnvNames]);

  return {
    newEnvNames,
    isNewEnv: (envName) => Boolean(envName && newEnvSet.has(envName)),
    markEnvSeen,
  };
}
