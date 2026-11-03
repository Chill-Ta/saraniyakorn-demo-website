import type { RouteObject } from 'react-router';
import { PATHS } from '../paths.js';
import HelpPage from './pages/HelpPage.js';

export const helpRoutes: RouteObject[] = [
  {
    path: PATHS.HELP,
    element: <HelpPage />,
  },
];
