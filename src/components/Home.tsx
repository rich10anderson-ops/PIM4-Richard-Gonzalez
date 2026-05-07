import React from 'react';


import { useNavigate } from 'react-router-dom';

interface HomeProps {
  isAuthenticated?: boolean;
  currentUser?: string | null;
  accountStatus?: string;
}

export const Home: React.FC<HomeProps> = ({ isAuthenticated, currentUser, accountStatus }) => {
  const navigate = useNavigate();
  return (
    <div className="home-dashboard-layout">
      {/* Main Content Area: Now holds the User Panel or Welcome Info */}
      <main className="main-content-area">
        {isAuthenticated ? (
          <div className="glass-panel user-panel-main">
            <h3 className="panel-title">Panel de Usuario</h3>
            
            <div className="panel-section">
              <span className="section-label">Estado de la Cuenta</span>
              <div className="status-badge active">
                {accountStatus || 'Activa'}
              </div>
            </div>

            <div className="panel-section">
              <span className="section-label">Servicios Médicos</span>
              <p className="section-description">
                Gestiona y revisa tu historial de tratamientos y recomendaciones estéticas.
              </p>
              <button 
                type="button"
                className="btn-primary-neon" 
                onClick={() => navigate('/tratamientos')}
              >
                Ver Mis Tratamientos
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-panel welcome-placeholder">
            <p>Inicia sesión para acceder a tu panel personalizado.</p>
            <button className="btn-primary-neon" onClick={() => navigate('/login')}>Login</button>
          </div>
        )}
      </main>

      {/* Fixed Sidebar on the Right: Logo and Greeting */}
      <aside className="fixed-sidebar-right">
        <div className="sidebar-logo-container">
          <h1 className="logo-text-gradient">
            L'ESTHÉTIQUE
          </h1>
        </div>
        
        <div className="sidebar-greeting">
          <p>
            {isAuthenticated 
              ? `¡Hola de nuevo, ${currentUser}! Estamos listos para tu próxima sesión de lujo.`
              : 'Bienvenidos al Salón del Futuro.'
            }
          </p>
          
          {isAuthenticated && (
            <button 
              type="button"
              className="btn-sidebar-action" 
              onClick={() => navigate('/turnos')}
            >
              Reservar Nuevo Turno
            </button>
          )}
        </div>
      </aside>

      {/* Background Puzzle Pieces */}
      <div className="puzzle-container">
        {[...Array(6)].map((_, i) => (
          <svg key={i} className={`puzzle-piece piece-${i + 1}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M20,20 C20,10 30,10 30,20 L40,20 C40,5 60,5 60,20 L80,20 L80,40 C95,40 95,60 80,60 L80,80 L60,80 C60,95 40,95 40,80 L20,80 L20,60 C5,60 5,40 20,40 Z" />
          </svg>
        ))}
      </div>
    </div>

  );
};
