import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { ViewState, FieldErrors } from '../types';

interface AuthProps {
  mode: 'login' | 'register';
  onAuthSuccess: (username: string) => void;
  onNavigate: (view: ViewState) => void;
}

async function mockSaveAuth(data: unknown) {
  await new Promise((r) => setTimeout(r, 800));
  if (Math.random() < 0.3) throw new Error("Error de conexión. Intenta de nuevo.");
  return { ok: true };
}

export const Auth: React.FC<AuthProps> = ({ mode, onAuthSuccess, onNavigate }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    status: 'pending',
    done: false
  });
  
  type AuthForm = typeof form;
  const [errors, setErrors] = useState<FieldErrors<AuthForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  function handleTextChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpiar el error cuando el usuario empiece a corregirlo
    if (errors[name as keyof AuthForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, status: e.target.value }));
  }

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, done: e.target.checked }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar
    const newErrors: FieldErrors<AuthForm> = {};
    if (form.username.length < 3) {
      newErrors.username = "El usuario debe tener al menos 3 caracteres.";
    }
    if (form.password.length < 5) {
      newErrors.password = "La contraseña debe tener al menos 5 caracteres.";
    }

    setErrors(newErrors);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    // Enviar
    try {
      setIsSubmitting(true);
      await mockSaveAuth(form);
      setSubmitSuccess(true);
      
      // Simulación de validación exitosa con delay para ver el éxito
      setTimeout(() => onAuthSuccess(form.username), 1000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel">
      <h2>{mode === 'login' ? 'Ingresar a tu Cuenta' : 'Registrarse como Nuevo Cliente'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input 
            id="username"
            type="text" 
            name="username"
            className="form-input" 
            value={form.username}
            onChange={handleTextChange}
            placeholder="ej. cliente_vip"
            style={{ borderColor: errors.username ? '#ff4d4d' : undefined }}
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && <span id="username-error" style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>Error: {errors.username}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input 
            id="password"
            type="password" 
            name="password"
            className="form-input" 
            value={form.password}
            onChange={handleTextChange}
            style={{ borderColor: errors.password ? '#ff4d4d' : undefined }}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && <span id="password-error" style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>Error: {errors.password}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="status">Estado de la cuenta</label>
          <select
            id="status"
            name="status"
            className="form-input"
            value={form.status}
            onChange={handleSelectChange}
          >
            <option value="pending">Pendiente</option>
            <option value="done">Hecha</option>
          </select>
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            id="done"
            type="checkbox"
            name="done"
            checked={form.done}
            onChange={handleCheckboxChange}
            style={{ width: 'auto' }}
          />
          <label htmlFor="done" style={{ margin: 0 }}>¿Mantener sesión iniciada? (Done)</label>
        </div>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting 
            ? (mode === 'login' ? 'Autenticando...' : 'Registrando...') 
            : (mode === 'login' ? 'Entrar al Sistema' : 'Crear mi Cuenta')}
        </button>

        <div style={{ minHeight: '50px', marginTop: '1.5rem', textAlign: 'center' }}>
          {submitError && (
            <div role="alert" style={{ color: "#ff4d4d", backgroundColor: 'rgba(255, 77, 77, 0.1)', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ff4d4d' }}>
              {submitError}
            </div>
          )}
          {submitSuccess && (
            <div role="status" style={{ color: "#4CAF50", backgroundColor: 'rgba(76, 175, 80, 0.1)', padding: '0.8rem', borderRadius: '8px', border: '1px solid #4CAF50' }}>
              {mode === 'login' ? '¡Bienvenido de vuelta! Accediendo...' : '¡Cuenta creada con éxito! Iniciando sesión...'}
            </div>
          )}
        </div>
      </form>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button 
          type="button"
          className="btn-outline" 
          style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}
          onClick={() => onNavigate(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
        </button>
      </div>
    </div>
  );
};
