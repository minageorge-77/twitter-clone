import { Navigate, useLocation } from "react-router-dom";
import { useMe } from "../hooks/useMe";

export function RequireAuth({ children }) {
  const location = useLocation();
  const me = useMe();

  if (me.isLoading) {
    return (
      <div className="min-h-dvh grid place-items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (me.isError) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return children;
}

