import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Método no permitido",
        });
    }

    try {
        const { tasks, userEmail } = req.body;

        const params = {
            Source: process.env.SES_FROM_EMAIL || process.env.SES_SENDER_EMAIL!,
            Destination: {
                ToAddresses: [userEmail],
            },
            Message: {
                Subject: {
                    Data: "Resumen de tareas",
                },
                Body: {
                    Text: {
                        Data: tasks
                            .map((t: any) => t.title)
                            .join(", "),
                    },
                },
            },
        };

        const command = new SendEmailCommand(params);

        await sesClient.send(command);

        return res.status(200).json({
            message: "Email enviado",
        });

    } catch (error: any) {
        console.error(error);

        return res.status(500).json({
            error: error.message,
        });
    }
}