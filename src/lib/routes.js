export const ROUTES = {
  home: "/",
  docs: "/docs",
  docsSection: (section = ":section") => `/docs/${section}`,
  docsEnvironment: (env = ":env") => `/docs/environments/${env}`,
  contact: "/contact",
  login: "/login",
  signup: "/signup",
  signin: "/signin",
  app: {
    strategies: "/app/strategies",
    newStrategy: "/app/strategies/new",
    strategyById: (strategyId = ":strategyId") =>
      `/app/strategies/${strategyId}`,
    results: "/app/results",
    resultById: (resultId = ":resultId") => `/app/results/${resultId}`,
    leaderboard: "/app/leaderboard",
    profile: "/app/profile",
    serviceEvaluations: "/app/service/evaluations",
  },
};
