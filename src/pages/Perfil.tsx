import { MensajePostGuardado } from '../components/MensajePostGuardado';

interface PerfilProps {
  currentUser: string | null;
  accountStatus?: string;
}

export function Perfil({ currentUser, accountStatus }: PerfilProps) {
  return (
    <section className="dashboard-page">
      <MensajePostGuardado />
      <h2>Servicios y Tratamientos</h2>
      <p>Administra tus seguimientos, tratamientos y horarios desde un solo lugar.</p>
      <div className="dashboard-details">
        <span>Usuario</span>
        <strong>{currentUser || 'Invitado'}</strong>
        <span>Estado del servicio</span>
        <strong>{accountStatus || 'Activa'}</strong>
      </div>
    </section>
  );
}
