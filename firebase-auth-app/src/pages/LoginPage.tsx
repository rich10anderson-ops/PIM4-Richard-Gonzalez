import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';
import { useAuth } from '../features/auth/useAuth';

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const { login, loading, error, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearAuthError();
    await login({ email, password });
    navigate(state?.from?.pathname ?? '/tasks', { replace: true });
  }

  return (
    <section className="panel auth-panel">
      <h1>Ingresar</h1>
      {state?.from ? <p className="notice">Iniciá sesión para acceder a {state.from.pathname}</p> : null}
      <form onSubmit={(event) => void handleSubmit(event)}>
        <TextInput label="Correo" name="email" type="email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} />
        <TextInput label="Contraseña" name="password" type="password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} />
        {error ? <p className="error" role="alert">{error}</p> : null}
        <Button type="submit" disabled={loading}>{loading ? 'Validando...' : 'Ingresar'}</Button>
      </form>
      <Link to="/register">Crear cuenta con correo y contraseña</Link>
    </section>
  );
}
