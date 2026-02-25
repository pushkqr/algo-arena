import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../lib/routes";

export default function useAuthRedirect({
  isAuthenticated,
  loading,
  blockRedirect = false,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const nextPath = useMemo(
    () => location.state?.from || ROUTES.app.strategies,
    [location.state],
  );

  useEffect(() => {
    if (isAuthenticated && !loading && !blockRedirect) {
      navigate(nextPath, { replace: true });
    }
  }, [isAuthenticated, loading, blockRedirect, navigate, nextPath]);

  const navigateToNextPath = useCallback(() => {
    navigate(nextPath, { replace: true });
  }, [navigate, nextPath]);

  return {
    nextPath,
    navigateToNextPath,
  };
}
