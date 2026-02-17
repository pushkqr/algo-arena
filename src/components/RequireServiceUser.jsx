import { Navigate } from "react-router-dom";
import { LoadingState } from "./AsyncState";
import useAuthState from "../hooks/useAuthState";
import { ROUTES } from "../lib/routes";

function RequireServiceUser({ children }) {
  const { loading, isService } = useAuthState();

  if (loading) {
    return <LoadingState message="Checking user permissions..." compact />;
  }

  if (!isService) {
    return <Navigate to={ROUTES.app.strategies} replace />;
  }

  return children;
}

export default RequireServiceUser;
