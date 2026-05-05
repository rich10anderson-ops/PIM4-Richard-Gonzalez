import { NavLink } from 'react-router-dom';
import { Button } from './ui/Button';

interface SidebarProps {
  open: boolean;
  onLogout: () => void;
}

export function Sidebar({ open, onLogout }: SidebarProps) {
  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Menú de usuario">
      <NavLink to="/tasks">Tareas</NavLink>
      <NavLink to="/email">Correo</NavLink>
      <Button type="button" variant="secondary" onClick={onLogout}>Cerrar sesión</Button>
    </aside>
  );
}
