import { Navigate } from 'react-router';
import { PATHS } from '../../paths';

export default function HomePage() {
  return <Navigate to={PATHS.AKSORNSARA} replace />;
}
