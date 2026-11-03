import type { RouteObject } from 'react-router';
import { PATHS } from '../paths';
import HomePage from './pages/HomePage';

export const homeRoutes: RouteObject[] = [
  {
    path: PATHS.ROOT,
    element: <HomePage />,
  },
];
