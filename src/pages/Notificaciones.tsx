export function Notificaciones() {
  return (
    <section className="dashboard-page">
      <h2>Notificaciones</h2>
      <p>Revisa avisos importantes sobre turnos, pagos y recomendaciones del salón.</p>
      <ul className="notification-list">
        <li>Tu próximo turno aparecerá aquí después de reservar.</li>
        <li>Los pagos completados se reflejarán en tu historial de cuenta.</li>
        <li>Activa recordatorios desde Configuración para recibir avisos.</li>
      </ul>
    </section>
  );
}
