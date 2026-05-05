import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendEmailSummary, validateEmailPayload } from './emailService';

describe('emailService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('valida payload antes de enviar', () => {
    expect(validateEmailPayload({ to: '', subject: 'x', message: 'x' })).toBe('Ingresá un correo válido.');
    expect(validateEmailPayload({ to: 'a@test.com', subject: '', message: 'x' })).toBe('El asunto es obligatorio.');
    expect(validateEmailPayload({ to: 'a@test.com', subject: 'x', message: '' })).toBe('El mensaje no puede estar vacío.');
  });

  it('lanza error si el serverless responde mal', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(sendEmailSummary({
      to: 'cliente@test.com',
      subject: 'Resumen',
      message: 'Contenido',
    })).rejects.toThrow('El servidor no pudo enviar el correo.');
  });

  it('envia payload valido al endpoint serverless', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await sendEmailSummary({
      to: 'cliente@test.com',
      subject: 'Resumen',
      message: 'Contenido',
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/send-email', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
  });
});
