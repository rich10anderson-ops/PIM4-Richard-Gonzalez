import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TaskForm } from './TaskForm';

describe('TaskForm', () => {
  it('no envia una tarea vacia', async () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /agregar/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('La tarea no puede estar vacía.');
  });

  it('envia una tarea valida', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/nueva tarea/i), 'Preparar color');
    await userEvent.click(screen.getByRole('button', { name: /agregar/i }));

    expect(onSubmit).toHaveBeenCalledWith({ title: 'Preparar color' });
  });
});
