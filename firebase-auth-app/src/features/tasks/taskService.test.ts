import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../firebase/config', () => ({ db: {} }));

const addDocMock = vi.fn<(collectionPath: unknown, payload: unknown) => Promise<void>>();
const collectionMock = vi.fn<(database: unknown, path: unknown) => string>(() => 'tasks-collection');
const serverTimestampMock = vi.fn(() => 'timestamp');

vi.mock('firebase/firestore', () => ({
  addDoc: (collectionPath: unknown, payload: unknown) => addDocMock(collectionPath, payload),
  collection: (database: unknown, path: unknown) => collectionMock(database, path),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  serverTimestamp: () => serverTimestampMock(),
  updateDoc: vi.fn(),
  where: vi.fn(),
}));

describe('taskService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rechaza tareas vacias antes de llamar Firestore', async () => {
    const { createTask } = await import('./taskService');

    await expect(createTask('user-1', { title: '   ' })).rejects.toThrow('La tarea no puede estar vacía.');
    expect(addDocMock).not.toHaveBeenCalled();
  });

  it('crea tareas asociadas al usuario autenticado', async () => {
    const { createTask } = await import('./taskService');

    await createTask('user-1', { title: '  Confirmar turno  ' });

    expect(addDocMock).toHaveBeenCalledWith('tasks-collection', expect.objectContaining({
      title: 'Confirmar turno',
      completed: false,
      userId: 'user-1',
    }));
  });
});
