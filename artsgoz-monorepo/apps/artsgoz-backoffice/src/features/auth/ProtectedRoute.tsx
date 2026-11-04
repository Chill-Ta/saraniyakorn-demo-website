import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token =
    (typeof window !== 'undefined' && localStorage.getItem('artsgoz_token')) ||
    (typeof window !== 'undefined' && sessionStorage.getItem('artsgoz_token'));

  const isValidToken = Boolean(
    token && token.trim() !== '' && token !== 'undefined' && token !== 'null'
  );

  if (!isValidToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;

