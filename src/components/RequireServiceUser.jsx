import { Navigate } from "react-router-dom";
import useAuthState from "../hooks/useAuthState";
import { ROUTES } from "../lib/routes";

function RequireServiceUser({ children }) {
  const { loading, isService } = useAuthState();

  if (loading) {
    return <p className="body-text">Checking user permissions...</p>;
  }

  if (!isService) {
    return <Navigate to={ROUTES.app.strategies} replace />;
  }

  return children;
}

export default RequireServiceUser;
