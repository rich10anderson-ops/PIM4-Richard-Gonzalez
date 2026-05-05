import { useNavigate } from 'react-router-dom';

export function Configuracion() {
  const navigate = useNavigate();

  function handleSave() {
    /*
      Cambio realizado: despues de guardar, navegamos al perfil enviando state.exito.
      Por que: MensajePostGuardado puede mostrar feedback sin crear estado global nuevo.
    */
    navigate('/dashboard/perfil', { state: { exito: true } });
  }

  return (
    <section className="dashboard-page">
      <h2>Configuración</h2>
      <p>Administra tus preferencias de atención, recordatorios y datos de contacto.</p>
      <div className="form-group">
        <label htmlFor="preferred-service">Servicio preferido</label>
        <input id="preferred-service" className="form-input" placeholder="Ej: Tratamiento Keratina Cristal" />
      </div>
      <button type="button" className="btn-primary" onClick={handleSave}>Guardar configuración</button>
    </section>
  );
}
