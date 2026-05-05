import { Link, Outlet } from 'react-router-dom';
import s from './Layout.module.css';

function Layout() {
  return (
    <div className={s.wrapper}>
      {/*
        Cambio realizado: este nav queda una sola vez alrededor de las rutas hijas.
        Por que: Link evita recargar la pagina y Outlet renderiza el contenido
        de la ruta activa dentro del mismo marco visual.
      */}
      <nav className={s.nav} aria-label="Navegacion simple">
        <span className={s.navLabel}>Ir a:</span>
        <Link to="/" className={s.navLink}>Inicio</Link>
        <span className={s.divider}>|</span>
        <Link to="/about" className={s.navLink}>Acerca de</Link>
        <span className={s.divider}>|</span>
        <Link to="/contact" className={s.navLink}>Contacto</Link>
        <span className={s.badge}>Layout compartido + Outlet</span>
      </nav>

      <main className={s.main}>
        {/*
          Cambio realizado: Outlet marca donde aparece cada pagina hija.
          Por que: React Router conserva este layout y solo cambia el contenido interno.
        */}
        <div className={s.outletHint}>&lt;Outlet /&gt; renderiza aqui la ruta activa</div>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
