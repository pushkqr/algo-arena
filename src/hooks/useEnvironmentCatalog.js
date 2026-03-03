import { useCallback, useEffect, useState } from "react";
import { metaApi } from "../api/metaApi";

const CACHE_TTL_MS = 5 * 60 * 1000;
const FALLBACK_ENV_OPTIONS = [{ name: "AuctionHouse", label: "AuctionHouse" }];

let cachedEnvOptions = null;
let cachedAtMs = 0;
let inFlightRequest = null;

function hasFreshCache() {
  if (!Array.isArray(cachedEnvOptions) || cachedEnvOptions.length === 0) {
    return false;
  }

  return Date.now() - cachedAtMs < CACHE_TTL_MS;
}

function normalizeEnvironmentOptions(payload) {
  const source = Array.isArray(payload?.environments)
    ? payload.environments
    : Array.isArray(payload?.data?.environments)
      ? payload.data.environments
      : Array.isArray(payload)
        ? payload
        : [];

  const normalized = source
    .filter((entry) => entry && entry.enabled !== false)
    .map((entry) => {
      const name = String(entry?.name || "").trim();
      const label = String(entry?.label || name).trim() || name;
      return { name, label };
    })
    .filter((entry) => Boolean(entry.name));

  const unique = new Map();
  normalized.forEach((entry) => {
    if (!unique.has(entry.name)) {
      unique.set(entry.name, entry);
    }
  });

  return Array.from(unique.values());
}

async function fetchEnvironmentOptions() {
  if (!inFlightRequest) {
    inFlightRequest = metaApi
      .listEnvironments()
      .then((payload) => normalizeEnvironmentOptions(payload))
      .finally(() => {
        inFlightRequest = null;
      });
  }

  return inFlightRequest;
}

export default function useEnvironmentCatalog() {
  const [envOptions, setEnvOptions] = useState(
    hasFreshCache() ? cachedEnvOptions : FALLBACK_ENV_OPTIONS,
  );
  const [loading, setLoading] = useState(!hasFreshCache());
  const [error, setError] = useState("");

  const load = useCallback(async (force = false) => {
    if (!force && hasFreshCache()) {
      setEnvOptions(cachedEnvOptions);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const options = await fetchEnvironmentOptions();
      const nextOptions = options.length > 0 ? options : FALLBACK_ENV_OPTIONS;

      cachedEnvOptions = nextOptions;
      cachedAtMs = Date.now();

      setEnvOptions(nextOptions);
    } catch (loadError) {
      setError(loadError?.message || "Failed to load environments.");
      setEnvOptions(hasFreshCache() ? cachedEnvOptions : FALLBACK_ENV_OPTIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const envNames = envOptions.map((entry) => entry.name);

  return {
    envOptions,
    envNames,
    loading,
    error,
    refresh: () => load(true),
  };
}
