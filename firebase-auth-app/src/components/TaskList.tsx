import type { Task } from '../types';
import { Button } from './ui/Button';

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty">Todavía no hay tareas para este usuario.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => void onToggle(task)}
            />
            <span className={task.completed ? 'done' : ''}>{task.title}</span>
          </label>
          <Button type="button" variant="danger" onClick={() => void onDelete(task.id)}>
            Eliminar
          </Button>
        </li>
      ))}
    </ul>
  );
}
