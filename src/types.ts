// ==========================================
// Tipos de Seguridad y Estructuras de Datos
// ==========================================

// 1. Tipos de Servicios Disponibles
export type ServiceId = 1 | 2 | 3 | 4;
export type ServiceCategory = 'Corte' | 'Coloración' | 'Tratamiento' | 'Estilismo';

export interface SalonService {
  id: ServiceId;
  name: string;
  category: ServiceCategory;
  price: number;
  durationMinutes: number;
}

// 2. Arrays Tipados (Inmutables)
// Uso de ReadonlyArray para evitar mutaciones accidentales en tiempo de ejecución
export const availableServices: ReadonlyArray<SalonService> = [
  { id: 1, name: 'Corte Clásico Premium', category: 'Corte', price: 25, durationMinutes: 45 },
  { id: 2, name: 'Decoloración y Tinte 2026', category: 'Coloración', price: 85, durationMinutes: 120 },
  { id: 3, name: 'Tratamiento Keratina Cristal', category: 'Tratamiento', price: 120, durationMinutes: 90 },
  { id: 4, name: 'Peinado de Gala', category: 'Estilismo', price: 40, durationMinutes: 60 }
];

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
  currentView: ViewState;
  isAuthenticated: boolean;
  currentUser: string | null;
  activeBooking: SecureBookingTuple | null;
  activePayment: SecurePaymentTuple | null;
}

// 5. Tipos Genéricos de Formularios
// Permite crear un objeto de errores donde cada llave del formulario es opcional y su valor es un string de error.
export type FieldErrors<T> = Partial<Record<keyof T, string>>;
