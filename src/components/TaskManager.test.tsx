import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskManager } from './TaskManager';
import * as firestore from 'firebase/firestore';

// Mock de firebase
vi.mock('firebase/firestore', () => {
  return {
    getFirestore: vi.fn(),
    collection: vi.fn(),
    addDoc: vi.fn(),
    onSnapshot: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    updateDoc: vi.fn(),
  };
});
vi.mock('../firebase/config', () => ({
  db: {}
}));

describe('TaskManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (firestore.onSnapshot as any).mockImplementation((_query: any, onNext: any) => {
      onNext({
        forEach: (cb: any) => {
          cb({ id: '1', data: () => ({ userId: 'user1', title: 'Test Task', subtasks: [] }) });
        }
      });
      return vi.fn(); // unsubscribe
    });
  });

  it('renders unauthenticated state when no userId is provided', () => {
    render(<TaskManager />);
    expect(screen.getByText('Debes iniciar sesión para ver tus tratamientos.')).toBeInTheDocument();
  });

  it('renders tasks and handles adding a new task', async () => {
    (firestore.addDoc as any).mockResolvedValueOnce({ id: '2' });

    render(<TaskManager userId="user1" />);
    
    // Debería cargar la tarea mockeada
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    // Agregar nueva tarea
    const input = screen.getByPlaceholderText(/Nuevo tratamiento/i);
    const addButton = screen.getByRole('button', { name: /Agregar/i });
    
    fireEvent.change(input, { target: { value: 'New Test Task' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(firestore.addDoc).toHaveBeenCalled();
    });
  });

  it('handles deleting a task', async () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    (firestore.deleteDoc as any).mockResolvedValueOnce({});

    render(<TaskManager userId="user1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByTitle('Eliminar tratamiento');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(firestore.deleteDoc).toHaveBeenCalled();
    });
  });
});
