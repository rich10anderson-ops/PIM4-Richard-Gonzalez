/// <reference types="node" />
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

interface EmailPayload {
  to?: unknown;
  subject?: unknown;
  message?: unknown;
}

interface ServerlessRequest {
  method?: string;
  body?: EmailPayload;
}

interface ServerlessResponse {
  setHeader(name: string, value: string): void;
  status(code: number): {
    json(payload: { ok: boolean; error?: string }): void;
    end(): void;
  };
}

export function validatePayload(payload: EmailPayload | undefined): string | null {
  if (!payload) return 'Payload requerido.';
  if (typeof payload.to !== 'string' || !payload.to.includes('@')) return 'Correo destino inválido.';
  if (typeof payload.subject !== 'string' || !payload.subject.trim()) return 'Asunto requerido.';
  if (typeof payload.message !== 'string' || !payload.message.trim()) return 'Mensaje requerido.';
  return null;
}

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  // Configurar encabezados CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Puedes cambiar '*' por el dominio exacto en producción
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Responder a peticiones preflight (OPTIONS) sin procesar el envío de correo
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: true, error: 'Método no permitido.' });
  }

  const validationError = validatePayload(req.body);
  if (validationError) {
    return res.status(400).json({ ok: false, error: validationError });
  }

  const { to, subject, message } = req.body as { to: string; subject: string; message: string };

  try {
    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Text: { Data: message },
        },
        Subject: { Data: subject },
      },
      Source: process.env.AWS_SES_FROM_EMAIL || "[EMAIL_ADDRESS]",
    });

    await sesClient.send(command);
    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error("Error de AWS SES:", error); // Esto se verá en los logs de tu servidor
    return res.status(500).json({
      ok: false,
      error: error.message || 'Error al enviar el email.'
    });
  }
}

