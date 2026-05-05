import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../features/auth/useAuth';

interface HomePageProps {
  onEnter: () => void;
}

export function HomePage({ onEnter }: HomePageProps) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <section className="home-hero">
      <div className="welcome-card">
        <p className="eyebrow">Peluquería urbana</p>
        <h1>Color, cortes y agenda en un solo lobby.</h1>
        <p>
          Gestioná tu sesión, tus tareas internas y el envío de resúmenes desde una app segura.
        </p>
        <Button type="button" onClick={onEnter}>Ingresa</Button>
      </div>
    </section>
  );
}
