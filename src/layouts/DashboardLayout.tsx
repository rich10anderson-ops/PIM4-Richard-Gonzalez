import { Link, Outlet } from 'react-router-dom';

interface DashboardLayoutProps {
  accountStatus: string;
}

export function DashboardLayout({ accountStatus }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout glass-panel">
      <nav className="dashboard-nav" aria-label="Menú del dashboard">
        <ul>
          <li>
            <Link to="perfil">Servicios y Tratamientos</Link>
          </li>
        </ul>
      </nav>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
