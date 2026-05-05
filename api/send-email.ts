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
  status(code: number): {
    json(payload: { ok: boolean; error?: string }): void;
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
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });
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
      Source: process.env.AWS_SES_FROM_EMAIL || "admin@esthetique2026.com",
    });

    await sesClient.send(command);
    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error("Error sending email via SES:", error);
    return res.status(500).json({ ok: false, error: 'Error al enviar el email.' });
  }
}
