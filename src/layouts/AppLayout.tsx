import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';


interface AppLayoutProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function AppLayout({
  isAuthenticated,
  onLogout,
}: AppLayoutProps) {
  return (
    <div className="app-container">
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
      />
      <div className="content-wrapper">
        <Outlet />
      </div>
    </div>
  );
}
