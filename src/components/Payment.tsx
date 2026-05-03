import React, { useState } from 'react';
import { availableServices } from '../types';
import type { SecurePaymentTuple, PaymentStatus, SecureBookingTuple } from '../types';

interface PaymentProps {
  activeBooking: SecureBookingTuple | null;
  onPaymentComplete: (payment: SecurePaymentTuple) => void;
}

export const Payment: React.FC<PaymentProps> = ({ activeBooking, onPaymentComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Derivamos el precio basado en la reserva activa
  const servicePrice = activeBooking 
    ? availableServices.find(s => s.id === activeBooking[1])?.price || 0 
    : 0;

  const handlePay = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      
      // Simular procesamiento de pago asíncrono
      await new Promise((r) => setTimeout(r, 2000));
      
      // Crear tupla de seguridad del pago
      const transactionId = 'TRX-' + Date.now();
      const status: PaymentStatus = 'completed';
      const paymentRecord: SecurePaymentTuple = [transactionId, servicePrice, status, Date.now()];
      
      setSubmitSuccess(true);
      
      setTimeout(() => {
        onPaymentComplete(paymentRecord);
      }, 1500);
    } catch (err) {
      setSubmitError("Error al procesar el pago. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activeBooking) {
    return (
      <div className="glass-panel">
        <h2>Pagar Servicio</h2>
        <p>No tienes turnos pendientes de pago. Reserva un turno primero.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <h2>Pagar Servicio</h2>
      <p>Detalles de facturación para tu cita (ID Cliente: {activeBooking[0]}).</p>

      <div style={{ margin: '2rem 0', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--color-silver)' }}>Monto Total</h3>
        <div style={{ fontSize: '3rem', color: 'var(--color-gold)', fontWeight: '700' }}>
          ${servicePrice}
        </div>
      </div>

      <button 
        type="button"
        className="btn-primary" 
        onClick={handlePay} 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Procesando Tarjeta...' : 'Pagar de Forma Segura'}
      </button>

      <div style={{ minHeight: '50px', marginTop: '1.5rem', textAlign: 'center' }}>
        {submitError && (
          <div role="alert" style={{ color: "#ff4d4d", backgroundColor: 'rgba(255, 77, 77, 0.1)', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ff4d4d' }}>
            {submitError}
          </div>
        )}
        {submitSuccess && (
          <div role="status" style={{ color: "#4CAF50", backgroundColor: 'rgba(76, 175, 80, 0.1)', padding: '0.8rem', borderRadius: '8px', border: '1px solid #4CAF50' }}>
            ¡Pago de ${servicePrice} procesado exitosamente!
          </div>
        )}
      </div>
    </div>
  );
};
