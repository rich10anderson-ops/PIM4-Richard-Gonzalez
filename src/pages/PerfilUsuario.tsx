import { useParams } from 'react-router-dom';
import { MensajePostGuardado } from '../components/MensajePostGuardado';

export function PerfilUsuario() {
  /*
    Cambio realizado: userId se toma desde la URL /perfil/:userId.
    Por que: useParams permite crear pantallas dinamicas sin duplicar rutas
    por cada usuario.
  */
  const { userId } = useParams<{ userId: string }>();

  return (
    <section className="glass-panel">
      <MensajePostGuardado />
      <h2>Perfil del usuario</h2>
      <p>Perfil del usuario {userId}</p>
    </section>
  );
}
