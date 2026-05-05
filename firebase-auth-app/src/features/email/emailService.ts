import type { EmailPayload } from '../../types';

export function validateEmailPayload(payload: EmailPayload): string | null {
  if (!payload.to.trim() || !payload.to.includes('@')) return 'Ingresá un correo válido.';
  if (!payload.subject.trim()) return 'El asunto es obligatorio.';
  if (!payload.message.trim()) return 'El mensaje no puede estar vacío.';
  return null;
}

export async function sendEmailSummary(payload: EmailPayload) {
  const validationError = validateEmailPayload(payload);
  if (validationError) {
    throw new Error(validationError);
  }

  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('El servidor no pudo enviar el correo.');
  }
}
