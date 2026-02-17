export const DEFAULT_PARSE_OPTIONS = {
  ecmaVersion: "latest",
  sourceType: "module",
  allowHashBang: true,
  locations: true,
};

export const MAX_SOURCE_LENGTH_WARNING = 100_000;
export const MAX_SOURCE_LENGTH_ERROR = 250_000;
export const MAX_AST_NODES_WARNING = 5_000;
export const MAX_AST_NODES_ERROR = 12_000;
export const MAX_AST_DEPTH_WARNING = 24;
export const MAX_AST_DEPTH_ERROR = 40;

export const REQUIRED_CONTRACT_METHODS = ["reset", "observe", "act"];

export const FORBIDDEN_IDENTIFIER_USAGE = new Set([
  "window",
  "document",
  "globalThis",
  "process",
  "require",
  "module",
  "exports",
  "__dirname",
  "__filename",
  "Deno",
  "Bun",
]);

export const FORBIDDEN_CALLS = new Set([
  "eval",
  "Function",
  "fetch",
  "XMLHttpRequest",
  "WebSocket",
  "importScripts",
]);
