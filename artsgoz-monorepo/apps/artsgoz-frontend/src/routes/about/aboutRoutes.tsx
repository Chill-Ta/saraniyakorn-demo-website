import type { RouteObject } from 'react-router';
import { PATHS } from '../paths';
import AboutPage from './pages/AboutPage';

export const aboutRoutes: RouteObject[] = [
  {
    path: PATHS.ABOUT,
    element: <AboutPage />,
  },
];
