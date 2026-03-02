export const ROUTES = {
  home: "/",
  about: "/about",
  tech: "/tech",
  docs: "/docs",
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
