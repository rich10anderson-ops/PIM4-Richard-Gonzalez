import React from 'react';
import { NavLink } from 'react-router-dom';
import type { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">L'ESTHÉTIQUE 2026</div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <NavLink className="nav-item" to="/" onClick={() => onNavigate('home')}>
              Inicio
            </NavLink>
            <NavLink className="nav-item" to="/about">
              Nosotros
            </NavLink>
            <NavLink className="nav-item" to="/turnos" onClick={() => onNavigate('booking')}>
              Turnos
            </NavLink>
            <NavLink className="nav-item" to="/contact">
              Contacto
            </NavLink>
            <NavLink className="nav-item" to="/ayuda" onClick={() => onNavigate('help')}>
              Ayuda
            </NavLink>
            <NavLink className="nav-item" to="/pago" onClick={() => onNavigate('payment')}>
              Pagar Servicio
            </NavLink>
            <NavLink className="nav-item" to="/dashboard/perfil" onClick={() => onNavigate('tasks')}>
              Dashboard
            </NavLink>
            <NavLink className="nav-item" to="/perfil/demo-user">
              Perfil URL
            </NavLink>
            <button type="button" className="nav-item" onClick={onLogout}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <NavLink className="nav-item" to="/login" onClick={() => onNavigate('login')}>
              Login
            </NavLink>
            <NavLink className="nav-item" to="/registro" onClick={() => onNavigate('register')}>
              Registrarse
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};
