import { useState } from 'react';
import type { AsyncState, EmailPayload } from '../../types';
import { sendEmailSummary } from './emailService';

const initialState: AsyncState = {
  loading: false,
  error: null,
  success: null,
};

export function useEmailSummary() {
  const [state, setState] = useState<AsyncState>(initialState);

  async function send(payload: EmailPayload) {
    setState({ loading: true, error: null, success: null });
    try {
      await sendEmailSummary(payload);
      setState({ loading: false, error: null, success: 'Correo enviado correctamente.' });
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'No se pudo enviar el correo.',
        success: null,
      });
    }
  }

  return { ...state, send };
}
