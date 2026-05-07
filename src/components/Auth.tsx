import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { FieldErrors } from '../types';
import { auth } from '../firebase/config';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

type LoginFormState = {
  email: string;
  password: string;
};

const initialLoginForm: LoginFormState = { email: "", password: "" };

interface AuthProps {
  mode: 'login' | 'register';
  onAuthSuccess: (username: string, status?: string, redirectTo?: string) => void;
}

interface LocationState {
  from?: { pathname: string };
}



export const Auth: React.FC<AuthProps> = ({ mode, onAuthSuccess }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const [form, setForm] = useState<LoginFormState>(initialLoginForm);
  const [errors, setErrors] = useState<FieldErrors<LoginFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [accountStatus] = useState('activa');


  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginFormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setSubmitError(null);
      setIsSubmitting(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onAuthSuccess(user.displayName || user.email || "Usuario Google", accountStatus, state?.from?.pathname);
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      setSubmitError(error.message || "Error al iniciar sesión con Google.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar
    const newErrors: FieldErrors<LoginFormState> = {};
    if (!form.email || form.email.length < 3) {
      newErrors.email = "El email debe tener al menos 3 caracteres.";
    }
    if (!form.password || form.password.length < 5) {
      newErrors.password = "La contraseña debe tener al menos 5 caracteres.";
    }

    setErrors(newErrors);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    // Enviar a Firebase Auth
    try {
      setIsSubmitting(true);
      let user;
      
      if (mode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        user = userCredential.user;
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
        user = userCredential.user;
      }

      setSubmitSuccess(true);
      onAuthSuccess(user.email || form.email, accountStatus, state?.from?.pathname);
    } catch (err: any) {
      let errorMessage = "Error inesperado. Intenta nuevamente.";
      
      // Traducir errores de Firebase al español
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "El correo ya está en uso. Intenta iniciar sesión.";
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMessage = "Correo o contraseña incorrectos.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "La contraseña es muy débil. Usa al menos 6 caracteres.";
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "Error de red. Verifica tu conexión.";
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel">
      <h2>{mode === 'login' ? 'Ingresar a tu Cuenta' : 'Registrarse como Nuevo Cliente'}</h2>

      <div style={{ marginBottom: '2rem', marginTop: '1.5rem', textAlign: 'center' }}>
        <button type="button" className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.8rem', gap: '10px', borderRadius: '8px', border: '1px solid var(--color-gold)', color: 'var(--color-gold)' }} onClick={handleGoogleSignIn} disabled={isSubmitting}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>
        {mode === 'login' && state?.from && (
          <p className="auth-redirect-message">
            Necesitás iniciar sesión para acceder a {state.from.pathname}
          </p>
        )}
        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', color: '#ccc' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
          <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>o usa tu email</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-input"
            value={form.email}
            onChange={handleInputChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            disabled={isSubmitting}
            style={{ borderColor: errors.email ? '#ff4d4d' : undefined }}
          />
          {errors.email && <p id="email-error" style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '0.25rem', margin: 0 }}>{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-input"
            value={form.password}
            onChange={handleInputChange}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            disabled={isSubmitting}
            style={{ borderColor: errors.password ? '#ff4d4d' : undefined }}
          />
          {errors.password && <p id="password-error" style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '0.25rem', margin: 0 }}>{errors.password}</p>}
        </div>



        <div style={{ minHeight: '50px', marginTop: '1.5rem', textAlign: 'center' }}>
          {submitError && (
            <div role="alert" style={{ color: "#ff4d4d", backgroundColor: 'rgba(255, 77, 77, 0.1)', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ff4d4d' }}>
              {submitError}
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting 
            ? (mode === 'login' ? 'Iniciando sesión...' : 'Registrando...') 
            : (mode === 'login' ? 'Iniciar sesión' : 'Crear mi Cuenta')}
        </button>

        {submitSuccess && (
          <p style={{ color: "#4CAF50", textAlign: 'center', marginTop: '1rem', fontWeight: 'bold' }}>
            {mode === 'login' ? '¡Acceso concedido!' : '¡Cuenta creada con éxito!'}
          </p>
        )}
      </form>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button 
          type="button"
          className="btn-outline" 
          style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}
          onClick={() => navigate(mode === 'login' ? '/registro' : '/login')}
        >
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
        </button>
      </div>
    </div>
  );
};
