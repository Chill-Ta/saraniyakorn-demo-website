import type { RouteObject } from 'react-router';
import { PATHS } from '../paths';
import DashboardPage from './pages/DashboardPage';

export const dashboardRoutes: RouteObject[] = [
  {
    path: PATHS.DASHBOARD.ROOT,
    element: <DashboardPage />,
  },
];
