import { useState } from 'react';

interface Task {
  id: number;
  text: string;
  done: boolean;
}   

export function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
      setNewTask('');
    }
  };
  
  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };
  
  return (
    <div>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id} onClick={() => toggleTask(task.id)}>
            {task.done ? '✓' : '○'} {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
}