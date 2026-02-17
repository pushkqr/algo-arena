import { Navigate, useLocation } from "react-router-dom";
import { LoadingState } from "./AsyncState";
import useAuthState from "../hooks/useAuthState";
import { ROUTES } from "../lib/routes";

function RequireAuth({ children }) {
  const location = useLocation();
  const { loading, isAuthenticated } = useAuthState();

  if (loading) {
    return <LoadingState message="Checking authentication..." compact />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
    );
  }

  return children;
}

export default RequireAuth;
