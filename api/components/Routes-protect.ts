import { useAuth } from "../features/auth/Authenticator";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
}

function RequireAuth({ children }: RequireAuthProps): JSX.Element {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Mientras Firebase verifica la sesión, mostramos loading
  if (loading) {
    return <p>Cargando sesión...</p>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default RequireAuth;