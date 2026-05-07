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
import { RequireAuth } from './components/RequireAuth';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Perfil } from './pages/Perfil';
import { PerfilUsuario } from './pages/PerfilUsuario';
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
    isAuthenticated: false,
    currentUser: null,
    activeBooking: null,
    activePayment: null,
    accountStatus: 'activa',
  });
  /*
    Cambio realizado: adaptamos el estado actual a la forma que espera RequireAuth.
    Por que: el guard de rutas necesita un usuario null/no-null, sin acoplarse a todo AppState.
  */
  const authUser = appState.isAuthenticated && appState.currentUser
    ? { email: appState.currentUser, uid: appState.currentUser }
    : null;


  const handleLogin = (username: string, status?: string, redirectTo?: string) => {
    setAppState(prev => ({ 
      ...prev, 
      isAuthenticated: true, 
      currentUser: username,
      accountStatus: status || 'activa'
    }));
    navigate(redirectTo || viewRoutes.home, { replace: Boolean(redirectTo) });
  };

  const handleLogout = () => {
    setAppState(prev => ({ 
      ...prev, 
      isAuthenticated: false, 
      currentUser: null, 

      activeBooking: null, // Opcionalmente limpar reservas al salir
      activePayment: null
    }));
    navigate(viewRoutes.home);
  };

  const handleBooking = (booking: SecureBookingTuple) => {
    setAppState(prev => ({
      ...prev,
      activeBooking: booking
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
            isAuthenticated={appState.isAuthenticated}
            onLogout={handleLogout}
          />
        }
      >
        <Route
          index
          element={
            <Home
              isAuthenticated={appState.isAuthenticated}
              currentUser={appState.currentUser}
              accountStatus={appState.accountStatus}
            />
          }
        />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Auth mode="login" onAuthSuccess={handleLogin} />} />
        <Route path="registro" element={<Auth mode="register" onAuthSuccess={handleLogin} />} />
        <Route path="turnos" element={<BookingForm onBook={handleBooking} />} />
        <Route path="pago" element={<Payment activeBooking={appState.activeBooking} onPaymentComplete={handlePayment} />} />
        <Route path="ayuda" element={<Help />} />
        <Route 
          path="tratamientos" 
          element={
            <RequireAuth user={authUser}>
              <TaskManager userId={appState.currentUser} />
            </RequireAuth>
          } 
        />
        <Route
          path="perfil/:userId"
          element={
            <RequireAuth user={authUser}>
              <PerfilUsuario />
            </RequireAuth>
          }
        />
        <Route path="dashboard" element={
          <RequireAuth user={authUser}>
            <DashboardLayout 
              accountStatus={appState.accountStatus || 'activa'} 
            />
          </RequireAuth>
        }>
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
