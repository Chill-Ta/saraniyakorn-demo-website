import { Link, Outlet } from 'react-router';
import { PATHS } from '../routes/paths';

export default function MainLayout() {
  return (
    <div>
      <nav style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <Link to={PATHS.AKSORNSARA}>Aksornsara</Link>
        <Link to={PATHS.YELLOW_CARD_BACKOFFICE}>Yellow Card</Link>
        <Link to={PATHS.DASHBOARD.ROOT}>Dashboard</Link>
      </nav>
      <Outlet />
    </div>
  );
}
