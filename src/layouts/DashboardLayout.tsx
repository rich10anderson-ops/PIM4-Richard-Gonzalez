import { Link, Outlet } from 'react-router-dom';

export function DashboardLayout() {
  return (
    <div className="dashboard-layout glass-panel">
      <nav className="dashboard-nav" aria-label="Menú del dashboard">
        <ul>
          <li>
            <Link to="perfil">Perfil</Link>
          </li>
          <li>
            <Link to="config">Configuración</Link>
          </li>
          <li>
            <Link to="notificaciones">Notificaciones</Link>
          </li>
        </ul>
      </nav>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
