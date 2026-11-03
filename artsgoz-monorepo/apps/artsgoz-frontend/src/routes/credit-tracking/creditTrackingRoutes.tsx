import type { RouteObject } from 'react-router';
import { PATHS } from '../paths';
import CreditTrackingPage from './pages/CreditTrackingPage';

export const creditTrackingRoutes: RouteObject[] = [
  {
    path: PATHS.CREDIT_TRACKING,
    element: <CreditTrackingPage />,
  },
];
