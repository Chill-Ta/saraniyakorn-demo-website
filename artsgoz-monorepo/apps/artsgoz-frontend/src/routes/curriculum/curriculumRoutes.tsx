import type { RouteObject } from 'react-router';
import { PATHS } from '../paths';
import CurriculumPage from './pages/CurriculumPage';

export const curriculumRoutes: RouteObject[] = [
  {
    path: PATHS.CURRICULUM,
    element: <CurriculumPage />,
  },
];
