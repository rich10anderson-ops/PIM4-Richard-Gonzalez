export function Configuracion() {
  return (
    <section className="dashboard-page">
      <h2>Configuración</h2>
      <p>Administra tus preferencias de atención, recordatorios y datos de contacto.</p>
      <div className="form-group">
        <label htmlFor="preferred-service">Servicio preferido</label>
        <input id="preferred-service" className="form-input" placeholder="Ej: Tratamiento Keratina Cristal" />
      </div>
      <button type="button" className="btn-primary">Guardar configuración</button>
    </section>
  );
}
