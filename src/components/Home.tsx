import React from 'react';
import type { ViewState } from '../types';

interface HomeProps {
  onNavigate: (view: ViewState) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="glass-panel" style={{ maxWidth: '800px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--color-gold)', marginBottom: '1rem' }}>
        L'ESTHÉTIQUE
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--color-text)' }}>
        Bienvenidos al Salón del Futuro. Experimenta el lujo, estilo y vanguardia con nuestros expertos.
      </p>
      
      <div style={{ marginTop: '3rem' }}>
        <button 
          type="button"
          className="btn-primary" 
          onClick={() => onNavigate('booking')}
          style={{ padding: '1rem 3rem', fontSize: '1.2rem', maxWidth: '300px' }}
        >
          Reservar Ahora
        </button>
      </div>
    </div>
  );
};
