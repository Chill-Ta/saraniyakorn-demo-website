import type { RouteObject } from 'react-router';
import { PATHS } from '../paths.js';
import FormsPage from './pages/FormsPage.js';
import YellowCardPage from './pages/YellowCardPage.js';

export const formsRoutes: RouteObject[] = [
  {
    path: PATHS.FORMS,
    element: <FormsPage />,
  },
  {
    path: PATHS.YELLOW_CARD,
    element: <YellowCardPage />,
  },
];
