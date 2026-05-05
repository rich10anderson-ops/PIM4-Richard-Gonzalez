import { Link, Outlet } from 'react-router-dom';

interface DashboardLayoutProps {
  accountStatus: string;
  onUpdateAccountStatus: (status: string) => void;
}

export function DashboardLayout({ accountStatus, onUpdateAccountStatus }: DashboardLayoutProps) {
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
        <div className="dashboard-account-status">
          <label htmlFor="toolbarAccountStatus" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--color-silver)' }}>Estado de la cuenta</label>
          <select 
            id="toolbarAccountStatus"
            className="form-input"
            value={accountStatus}
            onChange={(e) => onUpdateAccountStatus(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
          >
            <option value="activa">Activa</option>
            <option value="pendiente">Pendiente</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </nav>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
