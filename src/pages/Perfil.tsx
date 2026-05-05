interface PerfilProps {
  currentUser: string | null;
  accountStatus?: string;
}

export function Perfil({ currentUser, accountStatus }: PerfilProps) {
  return (
    <section className="dashboard-page">
      <h2>Perfil</h2>
      <p>Consulta la información principal de tu cuenta y el estado actual del servicio.</p>
      <div className="dashboard-details">
        <span>Usuario</span>
        <strong>{currentUser || 'Invitado'}</strong>
        <span>Estado</span>
        <strong>{accountStatus || 'activa'}</strong>
      </div>
    </section>
  );
}
