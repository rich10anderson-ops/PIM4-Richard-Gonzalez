import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const shareLinks = {
  x: (url: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent("L'ESTHÉTIQUE 2026 - Descubre el panel de tratamientos")}&url=${url}`,
  instagram: (url: string) => `https://www.instagram.com/?url=${url}`,
  facebook: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  whatsapp: (url: string) => `https://api.whatsapp.com/send?text=${encodeURIComponent('Mira esta página: ')}${url}`,
  discord: (url: string) => `https://discord.com/channels/@me`,
  slack: (url: string) => `https://slack.com/intl/en-ar/`,
};

export const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('theme-light', themeMode === 'light');
      document.body.classList.toggle('theme-dark', themeMode === 'dark');
    }
  }, [themeMode]);

  const sharePage = (network: keyof typeof shareLinks) => {
    const url = encodeURIComponent(window.location.href);
    const shareUrl = shareLinks[network](url);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setShareOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div>
          <div className="nav-brand">L'ESTHÉTIQUE 2026</div>
          <div className="nav-brand-subtitle">rich10anderson@gmail.com · lestetique.com</div>
        </div>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <NavLink className="nav-item" to="/tratamientos">
                Tratamientos
              </NavLink>
              <NavLink className="nav-item" to="/about">
                Te contamos sobre nosotros
              </NavLink>
            </>
          ) : (
            <NavLink className="nav-item" to="/login">
              Login
            </NavLink>
          )}
        </div>

        <div className="nav-actions">
          <button type="button" className="nav-action-btn" onClick={() => setToolbarOpen(open => !open)}>
            ☰ Menú
          </button>
          <button type="button" className="nav-action-btn" onClick={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}>
            {themeMode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          </button>
          <div className="share-menu">
            <button type="button" className="nav-action-btn" onClick={() => setShareOpen(open => !open)}>
              Compartir
            </button>
            {shareOpen && (
              <div className="share-dropdown">
                <button type="button" onClick={() => sharePage('x')} title="Compartir en X">🐦 X</button>
                <button type="button" onClick={() => sharePage('instagram')} title="Compartir en Instagram">📷 Instagram</button>
                <button type="button" onClick={() => sharePage('facebook')} title="Compartir en Facebook">📘 Facebook</button>
                <button type="button" onClick={() => sharePage('whatsapp')} title="Compartir en Whatsapp">💬 Whatsapp</button>
                <button type="button" onClick={() => sharePage('discord')} title="Compartir en Discord">🎮 Discord</button>
                <button type="button" onClick={() => sharePage('slack')} title="Compartir en Slack">📎 Slack</button>
              </div>
            )}
          </div>
          {isAuthenticated && (
            <button type="button" className="nav-action-btn nav-logout-btn" onClick={onLogout}>
              Cerrar Sesión
            </button>
          )}
        </div>
      </nav>

      <aside className={`side-toolbar ${toolbarOpen ? 'open' : ''}`} aria-label="Menú lateral de navegación">
        <div className="toolbar-header">Opciones</div>
        <ul className="toolbar-list">
          <li><NavLink to="/contact">Contacto</NavLink></li>
          <li><NavLink to="/ayuda">Ayuda</NavLink></li>
          <li><NavLink to="/pago">Pagar Servicio</NavLink></li>
          <li><NavLink to="/turnos">Turnos</NavLink></li>
          <li><NavLink to="/dashboard/perfil">Salpicadero</NavLink></li>
        </ul>
        <div className="toolbar-contact-card">
          <strong>Contacto directo</strong>
          <a href="mailto:rich10anderson@gmail.com">rich10anderson@gmail.com</a>
          <a href="https://lestetique.com" target="_blank" rel="noreferrer">lestetique.com</a>
        </div>
      </aside>
      {toolbarOpen && <div className="side-toolbar-backdrop" onClick={() => setToolbarOpen(false)} />}
    </>
  );
};
