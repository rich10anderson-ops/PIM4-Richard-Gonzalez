import React from 'react';
import { NavLink } from 'react-router-dom';


interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">L'ESTHÉTIQUE 2026</div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <NavLink className="nav-item" to="/">
              Inicio
            </NavLink>
            <NavLink className="nav-item" to="/about">
              Nosotros
            </NavLink>
            <NavLink className="nav-item" to="/turnos">
              Turnos
            </NavLink>
            <NavLink className="nav-item" to="/contact">
              Contacto
            </NavLink>
            <NavLink className="nav-item" to="/ayuda">
              Ayuda
            </NavLink>
            <NavLink className="nav-item" to="/pago">
              Pagar Servicio
            </NavLink>
            <NavLink className="nav-item" to="/dashboard/perfil">
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
            <NavLink className="nav-item" to="/login">
              Login
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};
