import {
  MAX_AST_DEPTH_ERROR,
  MAX_AST_DEPTH_WARNING,
  MAX_AST_NODES_ERROR,
  MAX_AST_NODES_WARNING,
  FORBIDDEN_IDENTIFIER_USAGE,
  FORBIDDEN_CALLS,
} from "./constants";
import {
  getCalleeName,
  getMemberPropertyName,
  getMemberRootName,
  walkAst,
} from "./astUtils";

export function runSecurityChecks(ast, addIssue) {
  const state = {
    functionStack: [],
    nodeCount: 0,
    maxDepth: 0,
  };

  walkAst(
    ast,
    {
      enter(node, _parent, context, depth) {
        context.nodeCount += 1;
        context.maxDepth = Math.max(context.maxDepth, depth);

        if (
          node.type === "FunctionDeclaration" ||
          node.type === "FunctionExpression" ||
          node.type === "ArrowFunctionExpression"
        ) {
          context.functionStack.push(node.id?.name || "");
        }

        if (
          node.type === "ImportDeclaration" ||
          node.type === "ImportExpression"
        ) {
          addIssue(
            "error",
            "Imports are not allowed in strategy source.",
            node,
            "IMPORT_NOT_ALLOWED",
          );
        }

        if (node.type === "DebuggerStatement") {
          addIssue(
            "warning",
            "Debugger statement detected.",
            node,
            "DEBUGGER_STATEMENT",
          );
        }

        if (node.type === "WithStatement") {
          addIssue(
            "error",
            "`with` statement is not allowed.",
            node,
            "WITH_NOT_ALLOWED",
          );
        }

        if (
          node.type === "Identifier" &&
          FORBIDDEN_IDENTIFIER_USAGE.has(node.name)
        ) {
          addIssue(
            "error",
            `Usage of \`${node.name}\` is not allowed in strategy source.`,
            node,
            "FORBIDDEN_IDENTIFIER",
          );
        }

        if (node.type === "CallExpression") {
          const calleeName = getCalleeName(node.callee);

          if (FORBIDDEN_CALLS.has(calleeName)) {
            addIssue(
              "error",
              `Calling \`${calleeName}\` is not allowed.`,
              node,
              "FORBIDDEN_CALL",
            );
          }

          if (
            (calleeName === "setTimeout" || calleeName === "setInterval") &&
            node.arguments?.[0]?.type === "Literal" &&
            typeof node.arguments[0].value === "string"
          ) {
            addIssue(
              "error",
              "String-based timers are not allowed.",
              node,
              "STRING_TIMER",
            );
          }
        }

        if (node.type === "NewExpression") {
          const calleeName = getCalleeName(node.callee);
          if (["Function", "WebSocket", "Worker"].includes(calleeName)) {
            addIssue(
              "error",
              `Constructing \`${calleeName}\` is not allowed.`,
              node,
              "FORBIDDEN_CONSTRUCTOR",
            );
          }
        }

        if (node.type === "MemberExpression") {
          const rootName = getMemberRootName(node);
          if (FORBIDDEN_IDENTIFIER_USAGE.has(rootName)) {
            addIssue(
              "error",
              `Accessing \`${rootName}\` members is not allowed.`,
              node,
              "FORBIDDEN_MEMBER_ROOT",
            );
          }
        }

        if (node.type === "AssignmentExpression") {
          const propertyName = getMemberPropertyName(node.left);
          if (propertyName === "__proto__" || propertyName === "prototype") {
            addIssue(
              "error",
              "Prototype mutation is not allowed.",
              node,
              "PROTOTYPE_MUTATION",
            );
          }
        }

        if (node.type === "ForStatement" && !node.test) {
          addIssue(
            "warning",
            "Potential infinite loop: `for(;;)` detected.",
            node,
            "INFINITE_LOOP_RISK",
          );
        }

        if (
          (node.type === "WhileStatement" ||
            node.type === "DoWhileStatement") &&
          node.test?.type === "Literal" &&
          node.test.value === true
        ) {
          addIssue(
            "warning",
            "Potential infinite loop: constant `true` loop condition.",
            node,
            "INFINITE_LOOP_RISK",
          );
        }

        if (node.type === "Literal" && node.regex) {
          const pattern = node.regex.pattern || "";
          if (/\((?:[^()]*[+*][^()]*)\)[+*]/.test(pattern)) {
            addIssue(
              "warning",
              "Regex may be vulnerable to catastrophic backtracking.",
              node,
              "REGEX_DOS_RISK",
            );
          }
        }
      },
      leave(node, _parent, context) {
        if (
          node.type === "FunctionDeclaration" ||
          node.type === "FunctionExpression" ||
          node.type === "ArrowFunctionExpression"
        ) {
          context.functionStack.pop();
        }
      },
    },
    state,
  );

  if (state.nodeCount > MAX_AST_NODES_ERROR) {
    addIssue(
      "error",
      "Code is too complex (AST node count exceeds safe limit).",
      null,
      "AST_NODE_LIMIT",
    );
  } else if (state.nodeCount > MAX_AST_NODES_WARNING) {
    addIssue(
      "warning",
      "Code complexity is high (large AST node count).",
      null,
      "AST_NODE_HIGH",
    );
  }

  if (state.maxDepth > MAX_AST_DEPTH_ERROR) {
    addIssue(
      "error",
      "Code nesting depth exceeds safe limit.",
      null,
      "AST_DEPTH_LIMIT",
    );
  } else if (state.maxDepth > MAX_AST_DEPTH_WARNING) {
    addIssue("warning", "Code nesting depth is high.", null, "AST_DEPTH_HIGH");
  }

  return state;
}
