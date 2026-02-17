import { Navigate, useLocation } from "react-router-dom";
import useAuthState from "../hooks/useAuthState";
import { ROUTES } from "../lib/routes";

function RequireAuth({ children }) {
  const location = useLocation();
  const { loading, isAuthenticated } = useAuthState();

  if (loading) {
    return <p className="body-text">Checking authentication...</p>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
    );
  }

  return children;
}

export default RequireAuth;
