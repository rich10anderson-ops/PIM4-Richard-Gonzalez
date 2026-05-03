import React from 'react';

export const Help: React.FC = () => {
  return (
    <div className="glass-panel">
      <h2>Centro de Ayuda</h2>
      <div style={{ textAlign: 'left', marginTop: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>¿Cómo tomar un turno?</h3>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
            Navega a la sección de "Tomar Turno", selecciona el servicio de peluquería deseado en el selector, ingresa la fecha y confirma.
          </p>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>¿Cómo pagar un servicio?</h3>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
            Una vez hayas tomado un turno, aparecerá la opción "Pagar Servicio" en tu menú si has iniciado sesión. Ingresa ahí para procesar el pago de forma segura.
          </p>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Soporte Técnico 2026</h3>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
            Contáctanos vía canal holográfico o al correo: soporte@lesthetique.com
          </p>
        </div>
      </div>
    </div>
  );
};
