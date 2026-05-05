import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';
import { useAuth } from '../features/auth/useAuth';

export function RegisterPage() {
  const { register, loading, error, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearAuthError();
    await register({ displayName, email, password });
    navigate('/tasks', { replace: true });
  }

  return (
    <section className="panel auth-panel">
      <h1>Crear cuenta</h1>
      <form onSubmit={(event) => void handleSubmit(event)}>
        <TextInput label="Nombre visible" name="displayName" value={displayName} onChange={(event) => setDisplayName(event.currentTarget.value)} />
        <TextInput label="Correo" name="email" type="email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} />
        <TextInput label="Contraseña" name="password" type="password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} />
        {error ? <p className="error" role="alert">{error}</p> : null}
        <Button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear cuenta'}</Button>
      </form>
      <Link to="/login">Ya tengo cuenta</Link>
    </section>
  );
}
