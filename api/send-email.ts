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

// El cliente se instancia dentro del handler para leer las env vars en tiempo de ejecución

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
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });
  }

  const validationError = validatePayload(req.body);
  if (validationError) {
    return res.status(400).json({ ok: false, error: validationError });
  }

  // Verificar configuración de AWS antes de enviar
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const fromEmail = process.env.AWS_SES_FROM_EMAIL;
  const region = process.env.AWS_REGION || "us-east-1";

  if (!accessKeyId || !secretAccessKey || !fromEmail) {
    console.error("AWS configuration missing. Keys present:", {
      hasKey: Boolean(accessKeyId),
      hasSecret: Boolean(secretAccessKey),
      hasFrom: Boolean(fromEmail),
    });
    return res.status(500).json({ ok: false, error: 'Configuración de AWS incompleta. Revisa las variables de entorno en Vercel.' });
  }

  // Crear el cliente SES aquí para asegurar que lee los env vars correctos
  const sesClient = new SESClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

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
      Source: fromEmail,
    });

    await sesClient.send(command);
    return res.status(200).json({ ok: true });
  } catch (error: any) {
    const errorMessage = error?.message || 'Error al enviar el email.';
    console.error("Error sending email via SES:", error);
    return res.status(500).json({ ok: false, error: `Error al enviar el email: ${errorMessage}` });
  }
}
