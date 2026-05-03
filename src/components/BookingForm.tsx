import React, { useState } from 'react';
import { availableServices } from '../types';
import type { SecureBookingTuple, ServiceId } from '../types';

interface BookingFormProps {
  onBook: (booking: SecureBookingTuple) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onBook }) => {
  const [selectedService, setSelectedService] = useState<ServiceId>(1);
  const [date, setDate] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);
    setSubmitSuccess(false);

    if (!date) {
      setFieldError("Por favor selecciona una fecha válida.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Simular retraso de red
      await new Promise((r) => setTimeout(r, 800));
      
      // Creación de una tupla de seguridad para la reserva
      const booking: SecureBookingTuple = ['CL-' + Date.now(), selectedService, date, false];
      setSubmitSuccess(true);
      
      setTimeout(() => {
        onBook(booking);
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel">
      <h2>Tomar un Turno</h2>
      <p>Selecciona tu servicio y la fecha para reservar tu cita.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="service">Servicio deseado</label>
          <select 
            id="service"
            className="form-input"
            value={selectedService}
            onChange={(e) => setSelectedService(Number(e.target.value) as ServiceId)}
          >
            {availableServices.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - ${service.price} ({service.durationMinutes} min)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Fecha y Hora</label>
          <input 
            id="date"
            type="datetime-local" 
            className="form-input" 
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (fieldError) setFieldError(null);
            }}
            aria-invalid={fieldError ? "true" : "false"}
            aria-describedby={fieldError ? "date-error" : undefined}
            style={{ borderColor: fieldError ? '#ff4d4d' : undefined }}
          />
          {fieldError && <span id="date-error" style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>Error: {fieldError}</span>}
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
        </button>
        
        <div style={{ minHeight: '50px', marginTop: '1.5rem', textAlign: 'center' }}>
          {submitSuccess && (
            <div role="status" style={{ color: "#4CAF50", backgroundColor: 'rgba(76, 175, 80, 0.1)', padding: '0.8rem', borderRadius: '8px', border: '1px solid #4CAF50' }}>
              ¡Turno reservado exitosamente! Preparando el pago...
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
