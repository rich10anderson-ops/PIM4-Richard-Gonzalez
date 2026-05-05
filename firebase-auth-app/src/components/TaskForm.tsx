import { useState } from 'react';
import type { FormEvent } from 'react';
import type { TaskFormValues } from '../types';
import { Button } from './ui/Button';
import { TextInput } from './ui/TextInput';

interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) {
      setError('La tarea no puede estar vacía.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ title: nextTitle });
      setTitle('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo crear la tarea.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <TextInput
        label="Nueva tarea"
        name="title"
        value={title}
        error={error}
        onChange={(event) => setTitle(event.currentTarget.value)}
        placeholder="Ej: confirmar cita de color"
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Guardando...' : 'Agregar'}
      </Button>
    </form>
  );
}
