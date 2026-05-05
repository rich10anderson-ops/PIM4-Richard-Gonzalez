import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';
import { useAuth } from '../features/auth/useAuth';
import { useEmailSummary } from '../features/email/useEmailSummary';

export function EmailPage() {
  const { user } = useAuth();
  const { loading, error, success, send } = useEmailSummary();
  const [to, setTo] = useState(user?.email ?? '');
  const [subject, setSubject] = useState('Resumen de tareas');
  const [message, setMessage] = useState('');

  const defaultMessage = useMemo(
    () => `Hola ${user?.displayName ?? 'equipo'}, este es el resumen operativo del salón.`,
    [user?.displayName],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await send({ to, subject, message: message || defaultMessage });
  }

  return (
    <section className="panel">
      <h1>Enviar correo</h1>
      <p>El payload se valida antes de enviarlo al endpoint serverless.</p>
      <form onSubmit={(event) => void handleSubmit(event)}>
        <TextInput label="Para" name="to" type="email" value={to} onChange={(event) => setTo(event.currentTarget.value)} />
        <TextInput label="Asunto" name="subject" value={subject} onChange={(event) => setSubject(event.currentTarget.value)} />
        <label className="field" htmlFor="message">
          <span>Mensaje</span>
          <textarea id="message" value={message} placeholder={defaultMessage} onChange={(event) => setMessage(event.currentTarget.value)} />
        </label>
        {error ? <p className="error" role="alert">{error}</p> : null}
        {success ? <p className="success" role="status">{success}</p> : null}
        <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar resumen'}</Button>
      </form>
    </section>
  );
}
