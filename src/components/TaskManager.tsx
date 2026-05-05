import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { EmailSummaryButton } from './EmailSummaryButton';

type Subtask = { id: number; body: string; done: boolean };

type Task = {
  id: string;
  userId: string;
  title: string;
  subtasks: Subtask[];
};

interface TaskManagerProps {
  userId?: string | null;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulario para nueva tarea
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const tasksData: Task[] = [];
        snapshot.forEach((doc) => {
          tasksData.push({ id: doc.id, ...doc.data() } as Task);
        });
        setTasks(tasksData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching tasks:", err);
        setError("Error al cargar los tratamientos.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newTitle.trim()) return;

    setIsAdding(true);
    setError(null);
    try {
      await addDoc(collection(db, 'tasks'), {
        userId,
        title: newTitle.trim(),
        subtasks: []
      });
      setNewTitle("");
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Error al agregar el tratamiento.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddSubtask = async (taskId: string, currentSubtasks: Subtask[]) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        subtasks: [...currentSubtasks, { id: Date.now(), body: '', done: false }]
      });
    } catch (err) {
      console.error("Error adding subtask:", err);
      setError("Error al agregar el paso.");
    }
  };

  const handleUpdateSubtask = async (taskId: string, currentSubtasks: Subtask[], subtaskId: number, field: keyof Subtask, value: string | boolean) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const updatedSubtasks = currentSubtasks.map(st => 
        st.id === subtaskId ? { ...st, [field]: value } : st
      );
      await updateDoc(taskRef, { subtasks: updatedSubtasks });
    } catch (err) {
      console.error("Error updating subtask:", err);
      setError("Error al actualizar el paso.");
    }
  };

  const handleRemoveSubtask = async (taskId: string, currentSubtasks: Subtask[], subtaskId: number) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const updatedSubtasks = currentSubtasks.filter(st => st.id !== subtaskId);
      await updateDoc(taskRef, { subtasks: updatedSubtasks });
    } catch (err) {
      console.error("Error removing subtask:", err);
      setError("Error al eliminar el paso.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("¿Seguro que deseas eliminar este tratamiento?")) return;
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Error al eliminar el tratamiento.");
    }
  };

  if (!userId) {
    return (
      <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <p>Debes iniciar sesión para ver tus tratamientos.</p>
      </div>
    );
  }

  // Prepara los datos para el email summary
  const emailTasks = tasks.map(t => {
    const total = t.subtasks.length;
    const done = t.subtasks.filter(st => st.done).length;
    const status = total === 0 ? "Sin pasos" : (done === total ? "Completado" : `En progreso (${done}/${total})`);
    return { title: t.title, status, description: t.subtasks.map(st => `- [${st.done ? 'x' : ' '}] ${st.body || 'Sin descripción'}`).join('\n') };
  });

  return (
    <div className="glass-panel" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Mis Tratamientos</h2>
      
      {error && <div style={{ color: '#ff4d4d', background: 'rgba(255,77,77,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
        <input 
          type="text" 
          className="form-input"
          value={newTitle} 
          onChange={e => setNewTitle(e.target.value)} 
          placeholder="Nuevo tratamiento (Ej: Limpieza Facial)" 
          style={{ flex: 1, margin: 0 }}
          disabled={isAdding}
        />
        <button type="submit" className="btn-primary" disabled={isAdding || !newTitle.trim()}>
          {isAdding ? 'Agregando...' : 'Agregar'}
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--color-silver)' }}>Cargando tratamientos...</p>
      ) : tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--color-silver)', fontStyle: 'italic' }}>
          No tienes tratamientos registrados.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {tasks.map(task => (
            <div key={task.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', position: 'relative' }}>
              <button 
                onClick={() => handleDeleteTask(task.id)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}
                title="Eliminar tratamiento"
              >
                🗑️
              </button>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-gold)' }}>{task.title}</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--color-silver)' }}>Pasos ({task.subtasks.length})</h4>
                <button type="button" className="btn-outline" onClick={() => handleAddSubtask(task.id, task.subtasks)} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                  + Añadir Paso
                </button>
              </div>

              {task.subtasks.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--color-silver)', fontStyle: 'italic' }}>Sin pasos asignados.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {task.subtasks.map((st, index) => (
                    <div key={st.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={st.done}
                        onChange={(e) => handleUpdateSubtask(task.id, task.subtasks, st.id, 'done', e.target.checked)}
                        style={{ width: 'auto' }}
                      />
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ margin: 0, flex: 1, padding: '0.5rem', fontSize: '0.9rem', background: 'rgba(0,0,0,0.2)' }}
                        value={st.body}
                        placeholder={`Descripción del paso ${index + 1}`}
                        onChange={(e) => handleUpdateSubtask(task.id, task.subtasks, st.id, 'body', e.target.value)}
                      />
                      <button type="button" onClick={() => handleRemoveSubtask(task.id, task.subtasks, st.id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <EmailSummaryButton tasks={emailTasks} />
          </div>
        </div>
      )}
    </div>
  );
};
