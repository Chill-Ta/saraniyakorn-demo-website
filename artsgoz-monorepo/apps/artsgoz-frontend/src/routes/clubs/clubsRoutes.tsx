import type { RouteObject } from 'react-router';
import { PATHS } from '../paths.js';
import ClubsPage from './pages/ClubsPage.js';

export const clubsRoutes: RouteObject[] = [
  {
    path: PATHS.CLUBS,
    element: <ClubsPage />,
  },
];
