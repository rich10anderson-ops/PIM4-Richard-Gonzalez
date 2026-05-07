// ==========================================
// Tipos de Seguridad y Estructuras de Datos
// ==========================================

// 1. Tipos de Servicios Disponibles
export type ServiceId = 1 | 2 | 3 | 4;

export interface GarajeService {
  id: ServiceId;
  name: string;
  price: number;
  durationMinutes: number;
}

export const availableServices: GarajeService[] = [
  { id: 1, name: 'Tratamiento Facial', price: 50, durationMinutes: 45 },
  { id: 2, name: 'Masaje Relax', price: 40, durationMinutes: 60 },
  { id: 3, name: 'Manicura', price: 20, durationMinutes: 30 },
  { id: 4, name: 'Pedicura', price: 25, durationMinutes: 40 },
];

// 2. Arrays Tipados (Inmutables)
// Uso de ReadonlyArray para evitar mutaciones accidentales en tiempo de ejecución


// 3. Tuplas de Seguridad
// Garantizan el orden exacto de los elementos de una transacción en memoria
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// SecurePaymentTuple: [TransactionID, Amount, Status, Timestamp]
export type SecurePaymentTuple = [string, number, PaymentStatus, number];

// SecureBookingTuple: [ClientID, ServiceId, DateString, IsConfirmed]
export type SecureBookingTuple = [string, ServiceId, string, boolean];

// 4. Interfaces de Estado de la Aplicación
export type ViewState = 'home' | 'login' | 'register' | 'booking' | 'payment' | 'help' | 'tasks';

export interface AppState {
  isAuthenticated: boolean;
  currentUser: string | null;
  activeBooking: SecureBookingTuple | null;
  activePayment: SecurePaymentTuple | null;
}

// 5. Tipos Genéricos de Formularios
// Permite crear un objeto de errores donde cada llave del formulario es opcional y su valor es un string de error.
export type FieldErrors<T> = Partial<Record<keyof T, string>>;
