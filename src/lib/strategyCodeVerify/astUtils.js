export function getLineInfo(node) {
  return {
    line: node?.loc?.start?.line,
    column:
      typeof node?.loc?.start?.column === "number"
        ? node.loc.start.column + 1
        : undefined,
  };
}

export function getMemberRootName(node) {
  let current = node;
  while (current && current.type === "MemberExpression") {
    current = current.object;
  }

  return current?.type === "Identifier" ? current.name : "";
}

export function getMemberPropertyName(node) {
  if (!node || node.type !== "MemberExpression") {
    return "";
  }

  if (!node.computed && node.property?.type === "Identifier") {
    return node.property.name;
  }

  if (node.computed && node.property?.type === "Literal") {
    return String(node.property.value);
  }

  return "";
}

export function getCalleeName(callee) {
  if (!callee) {
    return "";
  }

  if (callee.type === "Identifier") {
    return callee.name;
  }

  if (callee.type === "MemberExpression") {
    return getMemberPropertyName(callee);
  }

  return "";
}

export function walkAst(node, handlers, state, parent = null, depth = 0) {
  if (!node || typeof node.type !== "string") {
    return;
  }

  handlers.enter?.(node, parent, state, depth);

  for (const key of Object.keys(node)) {
    if (key === "loc" || key === "start" || key === "end") {
      continue;
    }

    const value = node[key];

    if (Array.isArray(value)) {
      for (const child of value) {
        if (child && typeof child.type === "string") {
          walkAst(child, handlers, state, node, depth + 1);
        }
      }
      continue;
    }

    if (value && typeof value.type === "string") {
      walkAst(value, handlers, state, node, depth + 1);
    }
  }

  handlers.leave?.(node, parent, state, depth);
}

export function extractPropertyName(node) {
  if (!node) {
    return "";
  }

  if (node.type === "Identifier") {
    return node.name;
  }

  if (node.type === "Literal") {
    return String(node.value);
  }

  return "";
}

export function getFunctionNodeFromProperty(propertyNode) {
  if (!propertyNode) {
    return null;
  }

  if (propertyNode.type === "Property") {
    if (propertyNode.method) {
      return propertyNode.value;
    }

    if (
      propertyNode.value?.type === "FunctionExpression" ||
      propertyNode.value?.type === "ArrowFunctionExpression"
    ) {
      return propertyNode.value;
    }
  }

  if (propertyNode.type === "MethodDefinition") {
    return propertyNode.value;
  }

  return null;
}

function resolveFunctionLikeNode(node, declarations) {
  if (!node) {
    return null;
  }

  if (
    node.type === "FunctionDeclaration" ||
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression"
  ) {
    return node;
  }

  if (node.type === "Identifier") {
    const resolved = declarations?.get(node.name);
    if (
      resolved?.type === "FunctionDeclaration" ||
      resolved?.type === "FunctionExpression" ||
      resolved?.type === "ArrowFunctionExpression"
    ) {
      return resolved;
    }
  }

  return null;
}

export function hasReturnStatement(functionNode) {
  if (!functionNode) {
    return false;
  }

  if (functionNode.type === "ArrowFunctionExpression") {
    if (functionNode.body?.type !== "BlockStatement") {
      return true;
    }
  }

  let foundReturn = false;
  walkAst(
    functionNode.body,
    {
      enter(node) {
        if (node.type === "ReturnStatement") {
          foundReturn = true;
        }
      },
    },
    {},
  );

  return foundReturn;
}

export function isFunctionBodyEmpty(functionNode) {
  if (!functionNode) {
    return true;
  }

  if (functionNode.type === "ArrowFunctionExpression") {
    if (functionNode.body?.type !== "BlockStatement") {
      return false;
    }
  }

  return (functionNode.body?.body || []).length === 0;
}

export function collectTopLevelDeclarations(ast) {
  const declarations = new Map();

  for (const node of ast.body) {
    if (
      (node.type === "FunctionDeclaration" ||
        node.type === "ClassDeclaration") &&
      node.id?.name
    ) {
      declarations.set(node.id.name, node);
      continue;
    }

    if (node.type === "VariableDeclaration") {
      for (const declaration of node.declarations || []) {
        if (declaration.id?.type === "Identifier" && declaration.init) {
          declarations.set(declaration.id.name, declaration.init);
        }
      }
    }
  }

  return declarations;
}

export function getReturnedObjectExpression(functionNode) {
  if (!functionNode) {
    return null;
  }

  if (functionNode.type === "ArrowFunctionExpression") {
    if (functionNode.body?.type === "ObjectExpression") {
      return functionNode.body;
    }
  }

  let foundObject = null;
  walkAst(
    functionNode.body,
    {
      enter(node) {
        if (
          !foundObject &&
          node.type === "ReturnStatement" &&
          node.argument?.type === "ObjectExpression"
        ) {
          foundObject = node.argument;
        }
      },
    },
    {},
  );

  return foundObject;
}

export function extractMethodsFromObjectExpression(
  objectExpression,
  declarations = new Map(),
) {
  const methods = new Map();

  for (const property of objectExpression?.properties || []) {
    if (property.type !== "Property") {
      continue;
    }

    const name = extractPropertyName(property.key);
    let functionNode = getFunctionNodeFromProperty(property);

    if (!functionNode) {
      functionNode = resolveFunctionLikeNode(property.value, declarations);
    }

    if (name && functionNode) {
      methods.set(name, functionNode);
    }
  }

  return methods;
}

export function extractMethodsFromClassNode(classNode) {
  const methods = new Map();

  for (const member of classNode?.body?.body || []) {
    if (member.type !== "MethodDefinition") {
      continue;
    }

    const name = extractPropertyName(member.key);
    const functionNode = getFunctionNodeFromProperty(member);

    if (name && functionNode) {
      methods.set(name, functionNode);
    }
  }

  return methods;
}

export function resolveDefaultExportNode(ast, declarations) {
  const exportDefault = ast.body.find(
    (node) => node.type === "ExportDefaultDeclaration",
  );

  if (!exportDefault) {
    return null;
  }

  const declarationNode = exportDefault.declaration;
  if (declarationNode?.type === "Identifier") {
    return declarations.get(declarationNode.name) || null;
  }

  return declarationNode;
}
