import React, { useState } from 'react';

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
  emailTo = "[EMAIL_ADDRESS]", 
  subject = "Resumen de Estado" 
}) => {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleSendEmail = async () => {
    // 1. Verificar si hay tareas
    if (tasks.length === 0) {
      alert("No hay tareas para incluir en el resumen.");
      return;
    }

    // 2. Formatear el resumen de las tareas en texto plano
    const bodyText = tasks.map((task, index) => {
      return `${index + 1}. ${task.title}
   Estado: ${task.status}
   ${task.description ? `Detalle: ${task.description}` : ''}`;
    }).join('\n\n');

    const preamble = "Hola,\n\nAdjunto el resumen del estado actual:\n\n";
    const signature = "\n\nSaludos,\nSistema L'ESTHÉTIQUE";
    const fullBody = preamble + bodyText + signature;

    setLoading(true);
    setStatusMsg("");

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: emailTo,
          subject: subject,
          message: fullBody
        })
      });

      const data = await response.json();
      if (data.ok) {
        setStatusMsg("Email enviado exitosamente.");
      } else {
        setStatusMsg("Error al enviar: " + (data.error || "Desconocido"));
      }
    } catch (error) {
      console.error(error);
      setStatusMsg("Error de red al enviar el email.");
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(""), 5000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <button 
        type="button"
        onClick={handleSendEmail} 
        className="btn-primary"
        disabled={loading}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
      >
        {/* Icono de sobre (mail) */}
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {loading ? "Enviando..." : "Enviar Resumen por Email"}
      </button>
      {statusMsg && <span style={{ fontSize: '0.85rem', color: statusMsg.includes("Error") ? "#ff4d4d" : "#4caf50" }}>{statusMsg}</span>}
    </div>
  );
};
