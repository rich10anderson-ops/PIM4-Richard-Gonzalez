import React, { useState } from 'react';
import type { ChangeEvent } from 'react';

type Subtask = { id: number; body: string; done: boolean };
type TaskForm = {
  title: string;
  subtasks: Subtask[];
};

export const TaskManager: React.FC = () => {
  const [form, setForm] = useState<TaskForm>({
    title: "",
    subtasks: [],
  });

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, title: e.target.value }));
  };

  const addSubtask = () => {
    setForm(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, { id: Date.now(), body: '', done: false }]
    }));
  };

  const handleSubtaskChange = (id: number, field: keyof Subtask, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st => 
        st.id === id ? { ...st, [field]: value } : st
      )
    }));
  };

  const removeSubtask = (id: number) => {
    setForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== id)
    }));
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Gestor de Tratamientos (Tareas Anidadas)</h2>
      <p>Añade un tratamiento principal y desglósalo en los pasos necesarios.</p>
      
      <div className="form-group" style={{ marginTop: '2rem' }}>
        <label>Tratamiento Principal (Title)</label>
        <input 
          type="text" 
          className="form-input"
          value={form.title} 
          onChange={handleTitleChange} 
          placeholder="Ej: Decoloración Platinum" 
        />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Pasos / Subtareas ({form.subtasks.length})</h3>
          <button type="button" className="btn-outline" onClick={addSubtask} style={{ padding: '0.5rem 1rem' }}>
            + Añadir Paso
          </button>
        </div>

        {form.subtasks.length === 0 ? (
          <p style={{ color: 'var(--color-silver)', fontStyle: 'italic', marginTop: '1rem' }}>
            No hay pasos añadidos todavía.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {form.subtasks.map((st, index) => (
              <div key={st.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                <input 
                  type="checkbox" 
                  checked={st.done}
                  onChange={(e) => handleSubtaskChange(st.id, 'done', e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ margin: 0, flex: 1 }}
                  value={st.body}
                  placeholder={`Descripción del paso ${index + 1}`}
                  onChange={(e) => handleSubtaskChange(st.id, 'body', e.target.value)}
                />
                <button type="button" onClick={() => removeSubtask(st.id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-gold)' }}>Estado en Tiempo Real (JSON)</h4>
        <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', overflowX: 'auto', textAlign: 'left' }}>
          {JSON.stringify(form, null, 2)}
        </pre>
      </div>
    </div>
  );
};
