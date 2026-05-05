import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
  user: { email: string; uid: string } | null;
  children: ReactNode;
}

export function RequireAuth({ user, children }: RequireAuthProps) {
  const location = useLocation();

  if (!user) {
    /*
      Cambio realizado: guardamos la ruta original en location.state.
      Por que: despues de iniciar sesion, el login puede devolver al usuario
      exactamente a la pagina protegida que intento abrir.
    */
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
