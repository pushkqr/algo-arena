export const NULL_OPTION_VALUE = "__NULL__";

export function normalizeEvaluationsResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.evaluations)) {
    return payload.evaluations;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

export function normalizeEvaluationResponse(payload) {
  if (!payload) {
    return null;
  }

  if (payload.evaluation && typeof payload.evaluation === "object") {
    return payload.evaluation;
  }

  if (payload.data && typeof payload.data === "object") {
    return payload.data;
  }

  if (typeof payload === "object") {
    return payload;
  }

  return null;
}

export function sortByMostRecent(rows) {
  return [...rows].sort((left, right) => {
    const leftTs = Date.parse(left?.updatedAt || left?.createdAt || "");
    const rightTs = Date.parse(right?.updatedAt || right?.createdAt || "");

    if (Number.isNaN(leftTs) && Number.isNaN(rightTs)) {
      return 0;
    }
    if (Number.isNaN(leftTs)) {
      return 1;
    }
    if (Number.isNaN(rightTs)) {
      return -1;
    }

    return rightTs - leftTs;
  });
}

export function asPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function extractEvaluationId(payload) {
  return (
    payload?.evaluationId ||
    payload?.evaluation?.evaluationId ||
    payload?.data?.evaluationId ||
    ""
  );
}

export function normalizeEnvOptionsResponse(payload, envName) {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload?.params)) {
    return payload.params;
  }

  if (Array.isArray(payload?.data?.params)) {
    return payload.data.params;
  }

  if (envName) {
    const envPayload = payload?.[envName] || payload?.data?.[envName];
    if (Array.isArray(envPayload?.params)) {
      return envPayload.params;
    }
  }

  return [];
}

export function normalizeEnvOptionParam(param) {
  return {
    key: param?.key || param?.name || "",
    type: param?.type || "string",
    enum: Array.isArray(param?.enum) ? param.enum : [],
    defaultValue: param?.default,
    nullable: Boolean(param?.nullable),
    required: Boolean(param?.required),
    description: param?.description || "",
  };
}

function toFormValue(param) {
  if (param.defaultValue === null) {
    return NULL_OPTION_VALUE;
  }

  if (param.defaultValue !== undefined) {
    return String(param.defaultValue);
  }

  if (param.nullable) {
    return NULL_OPTION_VALUE;
  }

  return "";
}

export function buildInitialEnvOptionValues(params) {
  return params.reduce((acc, param) => {
    if (!param.key) {
      return acc;
    }

    acc[param.key] = toFormValue(param);
    return acc;
  }, {});
}

function coerceEnvOptionValue(param, rawValue) {
  if (rawValue === NULL_OPTION_VALUE) {
    if (!param.nullable) {
      return {
        hasError: true,
        message: `${param.key} does not allow null.`,
      };
    }

    return {
      hasError: false,
      value: null,
      include: true,
    };
  }

  if (rawValue === "" || rawValue === undefined) {
    if (param.required) {
      return {
        hasError: true,
        message: `${param.key} is required.`,
      };
    }

    return {
      hasError: false,
      include: false,
    };
  }

  if (param.type === "number") {
    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue)) {
      return {
        hasError: true,
        message: `${param.key} must be a valid number.`,
      };
    }

    return {
      hasError: false,
      value: numericValue,
      include: true,
    };
  }

  if (param.type === "boolean") {
    if (rawValue === true || rawValue === "true") {
      return {
        hasError: false,
        value: true,
        include: true,
      };
    }

    if (rawValue === false || rawValue === "false") {
      return {
        hasError: false,
        value: false,
        include: true,
      };
    }

    return {
      hasError: true,
      message: `${param.key} must be true or false.`,
    };
  }

  const stringValue = String(rawValue);
  if (param.enum.length > 0 && !param.enum.includes(stringValue)) {
    return {
      hasError: true,
      message: `${param.key} must be one of: ${param.enum.join(", ")}.`,
    };
  }

  return {
    hasError: false,
    value: stringValue,
    include: true,
  };
}

export function buildEnvOptsPayload(params, values) {
  const envOpts = {};
  const errors = [];

  for (const param of params) {
    if (!param.key) {
      continue;
    }

    const coerced = coerceEnvOptionValue(param, values[param.key]);
    if (coerced.hasError) {
      errors.push(coerced.message);
      continue;
    }

    if (coerced.include) {
      envOpts[param.key] = coerced.value;
    }
  }

  return {
    envOpts,
    errors,
  };
}
