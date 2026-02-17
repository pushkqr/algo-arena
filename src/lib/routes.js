export const ROUTES = {
  home: "/",
  about: "/about",
  tech: "/tech",
  login: "/login",
  signin: "/signin",
  app: {
    strategies: "/app/strategies",
    newStrategy: "/app/strategies/new",
    strategyById: (strategyId = ":strategyId") =>
      `/app/strategies/${strategyId}`,
    results: "/app/results",
    resultById: (evaluationId = ":evaluationId") =>
      `/app/results/${evaluationId}`,
    leaderboard: "/app/leaderboard",
    profile: "/app/profile",
    serviceEvaluations: "/app/service/evaluations",
  },
};
