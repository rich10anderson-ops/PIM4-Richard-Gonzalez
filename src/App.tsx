import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import type { ViewState, AppState, SecureBookingTuple, SecurePaymentTuple } from './types';
import { AppLayout } from './layouts/AppLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Home } from './components/Home';
import { Auth } from './components/Auth';
import { BookingForm } from './components/BookingForm';
import { Payment } from './components/Payment';
import { Help } from './components/Help';
import { TaskManager } from './components/TaskManager';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Perfil } from './pages/Perfil';
import { Configuracion } from './pages/Configuracion';
import { Notificaciones } from './pages/Notificaciones';

const viewRoutes: Record<ViewState, string> = {
  home: '/',
  login: '/login',
  register: '/registro',
  booking: '/turnos',
  payment: '/pago',
  help: '/ayuda',
  tasks: '/dashboard/perfil',
};

function App() {
  const navigate = useNavigate();
  const [appState, setAppState] = useState<AppState & { accountStatus?: string }>({
    currentView: 'home',
    isAuthenticated: false,
    currentUser: null,
    activeBooking: null,
    activePayment: null,
    accountStatus: 'activa',
  });

  const navigateTo = (view: ViewState) => {
    setAppState(prev => ({ ...prev, currentView: view }));
    navigate(viewRoutes[view]);
  };

  const handleLogin = (username: string, status?: string) => {
    setAppState(prev => ({ 
      ...prev, 
      isAuthenticated: true, 
      currentUser: username,
      accountStatus: status || 'activa',
      currentView: 'home' 
    }));
    navigate(viewRoutes.home);
  };

  const handleLogout = () => {
    setAppState(prev => ({ 
      ...prev, 
      isAuthenticated: false, 
      currentUser: null, 
      currentView: 'home',
      activeBooking: null, // Opcionalmente limpar reservas al salir
      activePayment: null
    }));
    navigate(viewRoutes.home);
  };

  const handleBooking = (booking: SecureBookingTuple) => {
    setAppState(prev => ({
      ...prev,
      activeBooking: booking,
      currentView: 'payment' // Redirigir a pago inmediatamente o seguir en turnos
    }));
    navigate(viewRoutes.payment);
  };

  const handlePayment = (payment: SecurePaymentTuple) => {
    setAppState(prev => ({
      ...prev,
      activePayment: payment,
      // Una vez pagado, la reserva podría limpiarse o marcarse como confirmada
      activeBooking: prev.activeBooking ? [prev.activeBooking[0], prev.activeBooking[1], prev.activeBooking[2], true] : null
    }));
  };

  return (
    <Routes>
      <Route
        element={
          <AppLayout
            currentView={appState.currentView}
            onNavigate={navigateTo}
            isAuthenticated={appState.isAuthenticated}
            onLogout={handleLogout}
          />
        }
      >
        <Route
          index
          element={
            <Home
              onNavigate={navigateTo}
              isAuthenticated={appState.isAuthenticated}
              currentUser={appState.currentUser}
              accountStatus={appState.accountStatus}
            />
          }
        />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Auth mode="login" onAuthSuccess={handleLogin} onNavigate={navigateTo} />} />
        <Route path="registro" element={<Auth mode="register" onAuthSuccess={handleLogin} onNavigate={navigateTo} />} />
        <Route path="turnos" element={<BookingForm onBook={handleBooking} />} />
        <Route path="pago" element={<Payment activeBooking={appState.activeBooking} onPaymentComplete={handlePayment} />} />
        <Route path="ayuda" element={<Help />} />
        <Route path="tratamientos" element={<TaskManager />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="perfil" replace />} />
          <Route
            path="perfil"
            element={<Perfil currentUser={appState.currentUser} accountStatus={appState.accountStatus} />}
          />
          <Route path="config" element={<Configuracion />} />
          <Route path="notificaciones" element={<Notificaciones />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
