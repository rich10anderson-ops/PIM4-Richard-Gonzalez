import { describe, it, expect, vi } from 'vitest';
import handler, { validatePayload } from './send-email';
import * as sesClient from '@aws-sdk/client-ses';

// Mock SES
vi.mock('@aws-sdk/client-ses', () => {
  class SESClient {
    send = vi.fn().mockResolvedValue({});
  }
  class SendEmailCommand {}
  return { SESClient, SendEmailCommand };
});

describe('send-email API', () => {
  describe('validatePayload', () => {
    it('returns error if payload is missing', () => {
      expect(validatePayload(undefined)).toBe('Payload requerido.');
    });

    it('returns error if email is invalid', () => {
      expect(validatePayload({ to: 'invalid', subject: 'A', message: 'B' })).toBe('Correo destino inválido.');
    });

    it('returns error if subject is missing', () => {
      expect(validatePayload({ to: 'test@test.com', subject: '', message: 'B' })).toBe('Asunto requerido.');
    });

    it('returns error if message is missing', () => {
      expect(validatePayload({ to: 'test@test.com', subject: 'A', message: '' })).toBe('Mensaje requerido.');
    });

    it('returns null if payload is valid', () => {
      expect(validatePayload({ to: 'test@test.com', subject: 'A', message: 'B' })).toBeNull();
    });
  });

  describe('handler', () => {
    it('returns 405 if method is not POST', async () => {
      const req: any = { method: 'GET' };
      const res: any = {
        setHeader: vi.fn(),
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        end: vi.fn()
      };
      
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'Método no permitido.' });
    });

    it('returns 400 if payload is invalid', async () => {
      const req: any = { method: 'POST', body: {} };
      const res: any = {
        setHeader: vi.fn(),
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        end: vi.fn()
      };
      
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });

    it('handles OPTIONS requests for CORS preflight', async () => {
      const req: any = { method: 'OPTIONS' };
      const res: any = {
        setHeader: vi.fn(),
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        end: vi.fn()
      };
      
      await handler(req, res);
      
      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.end).toHaveBeenCalled();
    });
  });
});
