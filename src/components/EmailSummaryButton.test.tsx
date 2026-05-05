import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailSummaryButton } from './EmailSummaryButton';

describe('EmailSummaryButton', () => {
  const mockTasks = [
    { title: 'Tarea 1', status: 'Completado', description: '- [x] Paso 1' },
    { title: 'Tarea 2', status: 'En progreso (1/2)', description: '- [x] Paso 1\n- [ ] Paso 2' }
  ];

  beforeEach(() => {
    // Reset global fetch mock
    global.fetch = vi.fn();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('renders correctly', () => {
    render(<EmailSummaryButton tasks={mockTasks} />);
    expect(screen.getByRole('button', { name: /Enviar Resumen por Email/i })).toBeInTheDocument();
  });

  it('alerts if there are no tasks', () => {
    render(<EmailSummaryButton tasks={[]} />);
    const button = screen.getByRole('button', { name: /Enviar Resumen por Email/i });
    fireEvent.click(button);
    expect(window.alert).toHaveBeenCalledWith('No hay tareas para incluir en el resumen.');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('calls fetch with correct parameters and shows success message', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ ok: true })
    });

    render(<EmailSummaryButton tasks={mockTasks} emailTo="test@test.com" subject="Test Subject" />);
    const button = screen.getByRole('button', { name: /Enviar Resumen por Email/i });
    
    fireEvent.click(button);
    
    expect(button).toHaveTextContent(/Enviando.../i);
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/send-email', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('test@test.com')
      }));
    });

    await waitFor(() => {
      expect(screen.getByText('Email enviado exitosamente.')).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ ok: false, error: 'Invalid config' })
    });

    render(<EmailSummaryButton tasks={mockTasks} />);
    const button = screen.getByRole('button', { name: /Enviar Resumen por Email/i });
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Error al enviar: Invalid config')).toBeInTheDocument();
    });
  });
});
