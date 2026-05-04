import React from 'react';
import type { ViewState } from '../types';

interface HomeProps {
  onNavigate: (view: ViewState) => void;
  isAuthenticated?: boolean;
  currentUser?: string | null;
  accountStatus?: string;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, isAuthenticated, currentUser, accountStatus }) => {
  return (
    <div className="home-container" style={{ display: 'flex', gap: '2rem', maxWidth: isAuthenticated ? '1000px' : '800px', margin: '0 auto', alignItems: 'flex-start' }}>
      {/* Columna Principal */}
      <div className="glass-panel" style={{ flex: 1, textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--color-gold)', marginBottom: '1rem' }}>
          L'ESTHÉTIQUE
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text)' }}>
          {isAuthenticated 
            ? `¡Hola de nuevo, ${currentUser}! Estamos listos para tu próxima sesión de lujo.`
            : 'Bienvenidos al Salón del Futuro. Experimenta el lujo, estilo y vanguardia con nuestros expertos.'
          }
        </p>
        
        <div style={{ marginTop: '3rem' }}>
          <button 
            type="button"
            className="btn-primary" 
            onClick={() => onNavigate('booking')}
            style={{ padding: '1rem 3rem', fontSize: '1.2rem', maxWidth: '300px' }}
          >
            {isAuthenticated ? 'Reservar Nuevo Turno' : 'Reservar Ahora'}
          </button>
        </div>
      </div>

      {/* Columna de Interactividad (Solo visible si está logueado) */}
      {isAuthenticated && (
        <aside className="glass-panel" style={{ width: '300px', padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ color: 'var(--color-gold)', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem' }}>
            Panel de Usuario
          </h3>
          
          <div>
            <span style={{ fontSize: '0.9rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px' }}>Estado de la Cuenta</span>
            <div style={{ 
              marginTop: '0.5rem',
              padding: '0.5rem 1rem', 
              background: 'rgba(76, 175, 80, 0.1)', 
              border: '1px solid #4CAF50',
              color: '#4CAF50',
              borderRadius: '8px',
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }}>
              {accountStatus || 'Activa'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.9rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px' }}>Servicios Médicos</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Gestiona y revisa tu historial de tratamientos y recomendaciones estéticas.
            </p>
            <button 
              type="button"
              className="btn-outline" 
              onClick={() => onNavigate('tasks')}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-gold)', color: 'var(--color-gold)' }}
            >
              Ver Mis Tratamientos
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};
