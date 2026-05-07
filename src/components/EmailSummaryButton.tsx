import React, { useState } from 'react';
import { auth } from '../firebase/config';

export interface TaskItem {
  title: string;
  status: string;
  description?: string;
}

interface EmailSummaryButtonProps {
  tasks: TaskItem[];
  emailTo?: string;
  subject?: string;
}

export const EmailSummaryButton: React.FC<EmailSummaryButtonProps> = ({ 
  tasks, 

}) => {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
const [sendingEmail, setSendingEmail] = useState(false);
const handleSendEmail = async () => {
    if (tasks.length === 0) return alert("No tienes tareas para enviar.");

    setSendingEmail(true);
    try {
      const response = await fetch("/api/send_email", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        tasks,
        userEmail:auth.currentUser?.email,
    }),
});
      if (response.ok) {
        alert("✅ Resumen enviado con éxito a tu correo.");
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al enviar email:", error);
      alert("❌ No se pudo enviar el email.");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
 <button
            onClick={handleSendEmail}
            disabled={sendingEmail}
            >
            {sendingEmail ? "Enviando..." : "📧 Enviar Resumen por Email"}
          </button>
      {statusMsg && <span style={{ fontSize: '0.85rem', color: statusMsg.includes("Error") ? "#ff4d4d" : "#4caf50" }}>{statusMsg}</span>}
    </div>
  );
};
