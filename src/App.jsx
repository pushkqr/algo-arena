import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from "./components/Navbar";
import AppErrorBoundary from "./components/AppErrorBoundary";
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

function DelayedRouteFallback({ delayMs = 180 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setVisible(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delayMs]);

  if (!visible) {
    return null;
  }

  return (
    <div className="route-loading-screen" role="status" aria-live="polite">
      <span className="route-loading-spinner" aria-hidden="true" />
      <p className="route-loading-text">Loading...</p>
    </div>
  );
}

function App() {
  return (
    <div className="app-shell">
      <AppErrorBoundary>
        <Navbar />
        <main className="page-wrap">
          <Suspense fallback={<DelayedRouteFallback />}>
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
        </main>
      </AppErrorBoundary>
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
