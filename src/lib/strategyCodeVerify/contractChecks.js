import { REQUIRED_CONTRACT_METHODS } from "./constants";
import {
  hasReturnStatement,
  isFunctionBodyEmpty,
  collectTopLevelDeclarations,
  getReturnedObjectExpression,
  extractMethodsFromObjectExpression,
  extractMethodsFromClassNode,
  resolveDefaultExportNode,
} from "./astUtils";

export function analyzeContract(ast, addIssue) {
  const declarations = collectTopLevelDeclarations(ast);
  const exportNode = resolveDefaultExportNode(ast, declarations);

  if (!exportNode) {
    addIssue(
      "error",
      "Missing default export. Strategy must export a default implementation.",
      null,
      "MISSING_DEFAULT_EXPORT",
    );
    return {
      style: "unknown",
      methods: [],
      hasDecisionMethod: false,
    };
  }

  let style = "unknown";
  let methods = new Map();
  let directDecisionFunction = null;

  if (exportNode.type === "ObjectExpression") {
    style = "object";
    methods = extractMethodsFromObjectExpression(exportNode);
  } else if (
    exportNode.type === "ClassDeclaration" ||
    exportNode.type === "ClassExpression"
  ) {
    style = "class";
    methods = extractMethodsFromClassNode(exportNode);
  } else if (
    exportNode.type === "FunctionDeclaration" ||
    exportNode.type === "FunctionExpression" ||
    exportNode.type === "ArrowFunctionExpression"
  ) {
    const returnedObject = getReturnedObjectExpression(exportNode);
    if (returnedObject) {
      style = "factory-function";
      methods = extractMethodsFromObjectExpression(returnedObject);
    } else {
      style = "direct-function";
      directDecisionFunction = exportNode;
    }
  }

  if (style === "direct-function") {
    addIssue(
      "error",
      "Default export must provide `reset`, `observe`, and `act` methods. Export an object/class or a function that returns one.",
      exportNode,
      "UNUSABLE_EXPORT_SHAPE",
    );

    if (!hasReturnStatement(directDecisionFunction)) {
      addIssue(
        "warning",
        "Direct exported function has no return path.",
        exportNode,
        "NO_RETURN_PATH",
      );
    }

    return {
      style,
      methods: [],
      hasDecisionMethod: false,
    };
  }

  const methodNames = [...methods.keys()];

  if (methodNames.length === 0) {
    addIssue(
      "error",
      "No executable methods found on strategy export.",
      exportNode,
      "NO_STRATEGY_METHODS",
    );

    return {
      style,
      methods: methodNames,
      hasDecisionMethod: false,
    };
  }

  for (const requiredMethod of REQUIRED_CONTRACT_METHODS) {
    if (!methods.has(requiredMethod)) {
      addIssue(
        "error",
        `Missing required contract method: \`${requiredMethod}\`.`,
        exportNode,
        "MISSING_CONTRACT_METHOD",
      );
      continue;
    }

    const methodNode = methods.get(requiredMethod);
    if (isFunctionBodyEmpty(methodNode)) {
      addIssue(
        requiredMethod === "act" ? "error" : "warning",
        requiredMethod === "act"
          ? "`act` method cannot be empty."
          : `Method \`${requiredMethod}\` has an empty body.`,
        methodNode,
        requiredMethod === "act" ? "EMPTY_ACT_METHOD" : "EMPTY_CONTRACT_METHOD",
      );
    }
  }

  const actMethod = methods.get("act");

  if (
    actMethod &&
    !isFunctionBodyEmpty(actMethod) &&
    !hasReturnStatement(actMethod)
  ) {
    addIssue(
      "warning",
      "`act` has no explicit return path.",
      actMethod,
      "ACT_NO_RETURN",
    );
  }

  return {
    style,
    methods: methodNames,
    hasDecisionMethod: methods.has("act"),
  };
}
