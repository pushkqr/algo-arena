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
import Landing from "./pages/Landing";

const loadAbout = () => import("./pages/About");
const loadTech = () => import("./pages/Tech");
const loadDocs = () => import("./pages/Docs");
const loadContact = () => import("./pages/Contact");
const loadSignIn = () => import("./pages/SignIn");
const loadSignUp = () => import("./pages/SignUp");
const loadStrategies = () => import("./pages/Strategies");
const loadStrategyEditor = () => import("./pages/StrategyEditor");
const loadMyResults = () => import("./pages/MyResults");
const loadResultsDetail = () => import("./pages/ResultsDetail");
const loadLeaderboard = () => import("./pages/Leaderboard");
const loadProfile = () => import("./pages/Profile");
const loadServiceEvaluation = () => import("./pages/ServiceEvaluation");

const About = lazy(loadAbout);
const Tech = lazy(loadTech);
const Docs = lazy(loadDocs);
const Contact = lazy(loadContact);
const SignIn = lazy(loadSignIn);
const SignUp = lazy(loadSignUp);
const Strategies = lazy(loadStrategies);
const StrategyEditor = lazy(loadStrategyEditor);
const MyResults = lazy(loadMyResults);
const ResultsDetail = lazy(loadResultsDetail);
const Leaderboard = lazy(loadLeaderboard);
const Profile = lazy(loadProfile);
const ServiceEvaluation = lazy(loadServiceEvaluation);

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
  useEffect(() => {
    let cancelled = false;

    const prefetchPublicRoutes = [
      loadAbout,
      loadTech,
      loadDocs,
      loadContact,
      loadSignIn,
      loadSignUp,
      loadLeaderboard,
    ];

    const prefetchAppRoutes = [
      loadStrategies,
      loadStrategyEditor,
      loadMyResults,
      loadResultsDetail,
      loadProfile,
      loadServiceEvaluation,
    ];

    const safeRun = (loaders) => {
      if (cancelled) {
        return;
      }

      loaders.forEach((load) => {
        load().catch(() => {});
      });
    };

    const runPrefetch = () => {
      safeRun(prefetchPublicRoutes);
      window.setTimeout(() => safeRun(prefetchAppRoutes), 1100);
    };

    let idleCallbackId;
    let timeoutId;

    if ("requestIdleCallback" in window) {
      idleCallbackId = window.requestIdleCallback(runPrefetch, {
        timeout: 1400,
      });
    } else {
      timeoutId = window.setTimeout(runPrefetch, 350);
    }

    return () => {
      cancelled = true;

      if (idleCallbackId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallbackId);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

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
              <Route path={ROUTES.docs} element={<Docs />} />
              <Route path={ROUTES.contact} element={<Contact />} />
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
