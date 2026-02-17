import { parse } from "acorn";
import {
  DEFAULT_PARSE_OPTIONS,
  MAX_SOURCE_LENGTH_ERROR,
  MAX_SOURCE_LENGTH_WARNING,
} from "./constants";
import { getLineInfo } from "./astUtils";
import { runSecurityChecks } from "./securityChecks";
import { analyzeContract } from "./contractChecks";

function scoreIssues(issues) {
  return issues.reduce((sum, issue) => {
    if (issue.type === "error") {
      return sum + 25;
    }

    return sum + 6;
  }, 0);
}

export function verifyStrategySource(sourceCode) {
  const issues = [];

  const addIssue = (type, message, node, code) => {
    issues.push({
      type,
      code,
      message,
      ...getLineInfo(node),
    });
  };

  if (!sourceCode || !sourceCode.trim()) {
    addIssue("error", "Source code is empty.", null, "EMPTY_SOURCE");
    return {
      ok: false,
      errors: issues,
      warnings: [],
      riskScore: 100,
      stats: {
        sourceLength: 0,
        astNodeCount: 0,
        astDepth: 0,
      },
      contract: {
        style: "unknown",
        methods: [],
        hasDecisionMethod: false,
      },
      issues,
    };
  }

  if (sourceCode.length > MAX_SOURCE_LENGTH_ERROR) {
    addIssue(
      "error",
      "Source code is too large and exceeds safe limits.",
      null,
      "SOURCE_TOO_LARGE",
    );
  } else if (sourceCode.length > MAX_SOURCE_LENGTH_WARNING) {
    addIssue(
      "warning",
      "Source code is very large and may be expensive to evaluate.",
      null,
      "SOURCE_LARGE",
    );
  }

  let ast;
  try {
    ast = parse(sourceCode, DEFAULT_PARSE_OPTIONS);
  } catch (error) {
    addIssue(
      "error",
      error?.message || "Syntax error in strategy source.",
      {
        loc: {
          start: {
            line: error?.loc?.line,
            column: error?.loc?.column,
          },
        },
      },
      "SYNTAX_ERROR",
    );

    const errors = issues.filter((issue) => issue.type === "error");
    const warnings = issues.filter((issue) => issue.type === "warning");

    return {
      ok: false,
      errors,
      warnings,
      riskScore: scoreIssues(issues),
      stats: {
        sourceLength: sourceCode.length,
        astNodeCount: 0,
        astDepth: 0,
      },
      contract: {
        style: "unknown",
        methods: [],
        hasDecisionMethod: false,
      },
      issues,
    };
  }

  const securityState = runSecurityChecks(ast, addIssue);
  const contract = analyzeContract(ast, addIssue);

  const errors = issues.filter((issue) => issue.type === "error");
  const warnings = issues.filter((issue) => issue.type === "warning");

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    riskScore: Math.min(scoreIssues(issues), 100),
    stats: {
      sourceLength: sourceCode.length,
      astNodeCount: securityState.nodeCount,
      astDepth: securityState.maxDepth,
    },
    contract,
    issues,
  };
}
