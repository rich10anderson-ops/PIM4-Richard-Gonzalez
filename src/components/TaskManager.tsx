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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Formulario para nueva tarea
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    
    const unsubscribe = onSnapshot(q, { includeMetadataChanges: true },
      (snapshot) => {
        if (snapshot.metadata?.hasPendingWrites) {
          return;
        }

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

  const handleAddSubtask = async (taskId: string) => {
    const task = tasks.find((taskItem) => taskItem.id === taskId);
    if (!task) return;

    const newSubtask: Subtask = { id: Date.now(), body: '', done: false };
    const nextSubtasks = [...task.subtasks, newSubtask];
    
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { subtasks: nextSubtasks });
      setSuccessMessage('Paso agregado correctamente.');
      setTimeout(() => setSuccessMessage(null), 3000);
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
    setError(null);
    setSuccessMessage(null);

    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setSuccessMessage("Tratamiento eliminado.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Error al eliminar.");
    }
  };

  if (!userId) {
    return (
      <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <p>Debes iniciar sesión para ver tus tratamientos.</p>
      </div>
    );
  }

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emailTasks = filteredTasks.map(t => {
    const total = t.subtasks.length;
    const done = t.subtasks.filter(st => st.done).length;
    const status = total === 0 ? "Sin pasos" : (done === total ? "Completado" : `En progreso (${done}/${total})`);
    return { title: t.title, status, description: t.subtasks.map(st => `- [${st.done ? 'x' : ' '}] ${st.body || 'Sin descripción'}`).join('\n') };
  });

  return (
    <div className="glass-panel task-manager-panel">
      <h2 className="task-manager-title">Mis Tratamientos</h2>
      
      {error && <div className="task-manager-message task-manager-error">{error}</div>}
      {successMessage && <div className="task-manager-message task-manager-success">{successMessage}</div>}

      <div className="task-manager-search-container" style={{ marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          className="form-input search-input"
          placeholder="🔍 Buscar tratamiento..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(0, 243, 255, 0.2)' }}
        />
      </div>

      <form onSubmit={handleAddTask} className="task-manager-topbar">
        <input 
          type="text" 
          className="form-input task-manager-input"
          value={newTitle} 
          onChange={e => setNewTitle(e.target.value)} 
          placeholder="Nuevo tratamiento (Ej: Limpieza Facial)" 
          disabled={isAdding}
        />
        <button type="submit" className="btn-primary task-manager-add-btn" disabled={isAdding || !newTitle.trim()}>
          {isAdding ? 'Agregando...' : 'Agregar'}
        </button>
      </form>

      {loading ? (
        <p className="task-manager-empty-state">Cargando tratamientos...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="task-manager-empty-state">
          {searchQuery ? "No se encontraron coincidencias." : "No tienes tratamientos registrados."}
        </p>
      ) : (
        <div className="task-manager-list">
          {filteredTasks.map(task => (
            <div key={task.id} className="task-card">
              <button 
                onClick={() => handleDeleteTask(task.id)}
                className="task-delete-btn"
                title="Eliminar tratamiento"
              >
                🗑️
              </button>
              <h3 className="task-card-title">{task.title}</h3>
              
              <div className="task-card-header">
                <h4 className="task-card-subtitle">Pasos ({task.subtasks.length})</h4>
                <button 
                  type="button" 
                  className="btn-outline task-add-step-btn" 
                  onClick={() => handleAddSubtask(task.id)}
                >
                  ✍️ + Añadir Paso
                </button>
              </div>

              {task.subtasks.length === 0 ? (
                <p className="task-card-empty">Sin pasos asignados.</p>
              ) : (
                <div className="task-card-steps">
                  {task.subtasks.map((st, index) => (
                    <div key={st.id} className="task-step-row">
                      <input 
                        type="checkbox" 
                        checked={st.done}
                        onChange={(e) => handleUpdateSubtask(task.id, task.subtasks, st.id, 'done', e.target.checked)}
                        className="task-step-checkbox"
                      />
                      <input 
                        type="text" 
                        className="form-input task-step-input" 
                        value={st.body}
                        placeholder={`Descripción del paso ${index + 1}`}
                        onChange={(e) => handleUpdateSubtask(task.id, task.subtasks, st.id, 'body', e.target.value)}
                      />
                      <button type="button" className="task-step-remove-btn" onClick={() => handleRemoveSubtask(task.id, task.subtasks, st.id)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="email-summary-card">
            <EmailSummaryButton tasks={emailTasks} />
          </div>
        </div>
      )}

      {/* Background Puzzle Pieces para consistencia visual */}
      <div className="puzzle-container">
        {[...Array(6)].map((_, i) => (
          <svg key={i} className={`puzzle-piece piece-${i + 1}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M20,20 C20,10 30,10 30,20 L40,20 C40,5 60,5 60,20 L80,20 L80,40 C95,40 95,60 80,60 L80,80 L60,80 C60,95 40,95 40,80 L20,80 L20,60 C5,60 5,40 20,40 Z" />
          </svg>
        ))}
      </div>
    </div>
  );
};
