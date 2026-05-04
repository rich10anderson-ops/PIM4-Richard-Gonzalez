import { useState } from 'react';
import './App.css';
import type { ViewState, AppState, SecureBookingTuple, SecurePaymentTuple } from './types';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Auth } from './components/Auth';
import { BookingForm } from './components/BookingForm';
import { Payment } from './components/Payment';
import { Help } from './components/Help';
import { TaskManager } from './components/TaskManager';

function App() {
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
  };

  const handleLogin = (username: string, status?: string) => {
    setAppState(prev => ({ 
      ...prev, 
      isAuthenticated: true, 
      currentUser: username,
      accountStatus: status || 'activa',
      currentView: 'home' 
    }));
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
  };

  const handleBooking = (booking: SecureBookingTuple) => {
    setAppState(prev => ({
      ...prev,
      activeBooking: booking,
      currentView: 'payment' // Redirigir a pago inmediatamente o seguir en turnos
    }));
  };

  const handlePayment = (payment: SecurePaymentTuple) => {
    setAppState(prev => ({
      ...prev,
      activePayment: payment,
      // Una vez pagado, la reserva podría limpiarse o marcarse como confirmada
      activeBooking: prev.activeBooking ? [prev.activeBooking[0], prev.activeBooking[1], prev.activeBooking[2], true] : null
    }));
  };

  const renderView = () => {
    switch (appState.currentView) {
      case 'home':
        return <Home 
                 onNavigate={navigateTo} 
                 isAuthenticated={appState.isAuthenticated} 
                 currentUser={appState.currentUser} 
                 accountStatus={appState.accountStatus} 
               />;
      case 'login':
        return <Auth mode="login" onAuthSuccess={handleLogin} onNavigate={navigateTo} />;
      case 'register':
        return <Auth mode="register" onAuthSuccess={handleLogin} onNavigate={navigateTo} />;
      case 'booking':
        return <BookingForm onBook={handleBooking} />;
      case 'payment':
        return <Payment activeBooking={appState.activeBooking} onPaymentComplete={handlePayment} />;
      case 'help':
        return <Help />;
      case 'tasks':
        return <TaskManager />;
      default:
        return <Home 
                 onNavigate={navigateTo} 
                 isAuthenticated={appState.isAuthenticated} 
                 currentUser={appState.currentUser} 
                 accountStatus={appState.accountStatus} 
               />;
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        currentView={appState.currentView} 
        onNavigate={navigateTo} 
        isAuthenticated={appState.isAuthenticated}
        onLogout={handleLogout}
      />
      <div className="content-wrapper">
        {renderView()}
      </div>
    </div>
  );
}

export default App;
