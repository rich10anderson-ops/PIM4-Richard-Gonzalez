import { useLocation } from 'react-router-dom';

interface LocationState {
  exito?: boolean;
}

export function MensajePostGuardado() {
  const location = useLocation();
  /*
    Cambio realizado: leemos location.state con optional chaining.
    Por que: state puede no existir cuando el usuario entra directo por URL,
    asi evitamos errores al acceder a una propiedad opcional.
  */
  const state = location.state as LocationState | null;

  return state?.exito ? (
    <p className="success-message">¡Perfil guardado correctamente!</p>
  ) : null;
}
