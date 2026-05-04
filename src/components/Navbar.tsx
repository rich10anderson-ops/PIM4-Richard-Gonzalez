import React from 'react';
import type { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">L'ESTHÉTIQUE 2026</div>
      <div className="nav-links">
        <button 
          type="button"
          className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Inicio
        </button>
        <button type="button" className={`nav-item ${currentView === 'booking' ? 'active' : ''}`} onClick={() => onNavigate('booking')}>
          Turnos
        </button>

        <button type="button" className={`nav-item ${currentView === 'help' ? 'active' : ''}`} onClick={() => onNavigate('help')}>
          Ayuda
        </button>
        
        {isAuthenticated ? (
          <>
            <button 
              type="button"
              className={`nav-item ${currentView === 'payment' ? 'active' : ''}`}
              onClick={() => onNavigate('payment')}
            >
              Pagar Servicio
            </button>
            <button type="button" className="nav-item" onClick={onLogout}>Cerrar Sesión</button>
          </>
        ) : (
          <>
            <button 
              type="button"
              className={`nav-item ${currentView === 'login' ? 'active' : ''}`}
              onClick={() => onNavigate('login')}
            >
              Ingresar
            </button>
            <button 
              type="button"
              className={`nav-item ${currentView === 'register' ? 'active' : ''}`}
              onClick={() => onNavigate('register')}
            >
              Registrarse
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
