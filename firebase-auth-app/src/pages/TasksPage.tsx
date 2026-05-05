import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { useAuth } from '../features/auth/useAuth';
import { useTasks } from '../features/tasks/useTasks';

export function TasksPage() {
  const { user } = useAuth();
  const {
    tasks,
    loading,
    error,
    addTask,
    toggleTaskStatus,
    deleteTask,
  } = useTasks(user?.uid ?? null);

  return (
    <section className="panel">
      <h1>Tareas del salón</h1>
      <p>Sincronizadas en Firestore y filtradas por el usuario autenticado.</p>
      <TaskForm onSubmit={addTask} />
      {loading ? <p className="status">Sincronizando tareas...</p> : null}
      {error ? <p className="error" role="alert">{error}</p> : null}
      <TaskList tasks={tasks} onToggle={toggleTaskStatus} onDelete={deleteTask} />
    </section>
  );
}
