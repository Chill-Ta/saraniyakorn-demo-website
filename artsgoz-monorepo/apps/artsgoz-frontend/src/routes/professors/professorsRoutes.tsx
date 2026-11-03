import type { RouteObject } from 'react-router';
import { PATHS } from '../paths';
import ProfessorsPage from './pages/ProfessorsPage';

export const professorsRoutes: RouteObject[] = [
  {
    path: PATHS.PROFESSORS,
    element: <ProfessorsPage />,
  },
];
