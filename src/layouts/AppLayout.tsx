import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import type { ViewState } from '../types';

interface AppLayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function AppLayout({
  currentView,
  onNavigate,
  isAuthenticated,
  onLogout,
}: AppLayoutProps) {
  return (
    <div className="app-container">
      <Navbar
        currentView={currentView}
        onNavigate={onNavigate}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
      />
      <div className="content-wrapper">
        <Outlet />
      </div>
    </div>
  );
}
