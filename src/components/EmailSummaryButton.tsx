import React from 'react';

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
  emailTo = "admin@esthetique2026.com", 
  subject = "Resumen de Estado" 
}) => {
  const handleSendEmail = () => {
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

    // 3. Codificar el texto para que sea válido en una URL
    const fullBody = encodeURIComponent(preamble + bodyText + signature);
    const encodedSubject = encodeURIComponent(subject);

    // 4. Abrir el cliente de correo por defecto (Gmail, Outlook, Mail, etc.)
    window.location.href = `mailto:${emailTo}?subject=${encodedSubject}&body=${fullBody}`;
  };

  return (
    <button 
      type="button"
      onClick={handleSendEmail} 
      className="btn-primary"
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
    >
      {/* Icono de sobre (mail) */}
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      Enviar Resumen por Email
    </button>
  );
};
