import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from "./components/Navbar";
import AppErrorBoundary from "./components/AppErrorBoundary";
import { LoadingState } from "./components/AsyncState";
import RequireAuth from "./components/RequireAuth";
import RequireServiceUser from "./components/RequireServiceUser";
import { ROUTES } from "./lib/routes";

const Landing = lazy(() => import("./pages/Landing"));
const About = lazy(() => import("./pages/About"));
const Tech = lazy(() => import("./pages/Tech"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Strategies = lazy(() => import("./pages/Strategies"));
const StrategyEditor = lazy(() => import("./pages/StrategyEditor"));
const MyResults = lazy(() => import("./pages/MyResults"));
const ResultsDetail = lazy(() => import("./pages/ResultsDetail"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Profile = lazy(() => import("./pages/Profile"));
const ServiceEvaluation = lazy(() => import("./pages/ServiceEvaluation"));

function App() {
  const location = useLocation();
  const isLandingRoute = location.pathname === ROUTES.home;

  return (
    <div className={`app-shell${isLandingRoute ? " app-shell--landing" : ""}`}>
      <Navbar />
      <main
        className={`page-wrap${isLandingRoute ? " page-wrap--landing" : ""}`}
      >
        <AppErrorBoundary>
          <Suspense
            fallback={<LoadingState message="Loading page..." compact />}
          >
            <Routes>
              <Route path={ROUTES.home} element={<Landing />} />
              <Route path={ROUTES.about} element={<About />} />
              <Route path={ROUTES.tech} element={<Tech />} />
              <Route path={ROUTES.login} element={<SignIn />} />
              <Route path={ROUTES.signup} element={<SignUp />} />
              <Route
                path={ROUTES.signin}
                element={<Navigate to={ROUTES.login} replace />}
              />

              <Route
                path={ROUTES.app.strategies}
                element={
                  <RequireAuth>
                    <Strategies />
                  </RequireAuth>
                }
              />
              <Route
                path={ROUTES.app.newStrategy}
                element={
                  <RequireAuth>
                    <StrategyEditor />
                  </RequireAuth>
                }
              />
              <Route
                path={ROUTES.app.strategyById()}
                element={
                  <RequireAuth>
                    <StrategyEditor />
                  </RequireAuth>
                }
              />
              <Route
                path={ROUTES.app.results}
                element={
                  <RequireAuth>
                    <MyResults />
                  </RequireAuth>
                }
              />
              <Route
                path={ROUTES.app.resultById()}
                element={
                  <RequireAuth>
                    <ResultsDetail />
                  </RequireAuth>
                }
              />
              <Route
                path={ROUTES.app.leaderboard}
                element={
                  <RequireAuth>
                    <Leaderboard />
                  </RequireAuth>
                }
              />
              <Route
                path={ROUTES.app.profile}
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path={ROUTES.app.serviceEvaluations}
                element={
                  <RequireAuth>
                    <RequireServiceUser>
                      <ServiceEvaluation />
                    </RequireServiceUser>
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
            </Routes>
          </Suspense>
        </AppErrorBoundary>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="aa-toast"
        bodyClassName="aa-toast-body"
        progressClassName="aa-toast-progress"
      />
    </div>
  );
}

export default App;
