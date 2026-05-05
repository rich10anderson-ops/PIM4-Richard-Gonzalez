import { useEffect, useState } from 'react';
import type { Task, TaskFormValues } from '../../types';
import {
  createTask,
  deleteTask,
  subscribeToUserTasks,
  toggleTaskStatus,
} from './taskService';

export function useTasks(userId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    return subscribeToUserTasks(
      userId,
      (nextTasks) => {
        setTasks(nextTasks);
        setSyncedUserId(userId);
        setError(null);
      },
      () => {
        setError('No se pudieron sincronizar las tareas.');
      },
    );
  }, [userId]);

  async function addTask(values: TaskFormValues) {
    if (!userId) throw new Error('Debés iniciar sesión para crear tareas.');
    await createTask(userId, values);
  }

  return {
    tasks: userId ? tasks : [],
    loading: Boolean(userId && syncedUserId !== userId && !error),
    error: userId ? error : null,
    addTask,
    toggleTaskStatus,
    deleteTask,
  };
}
