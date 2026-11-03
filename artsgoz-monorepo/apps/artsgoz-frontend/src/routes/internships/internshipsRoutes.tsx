import type { RouteObject } from 'react-router';
import { PATHS } from '../paths';
import InternshipsPage from './pages/InternshipsPage';
import CurrentlyOpenPage from './pages/CurrentlyOpenPage';
import InternshipReviewPage from './pages/InternshipReviewPage';

export const internshipsRoutes: RouteObject[] = [
  {
    path: PATHS.INTERNSHIPS,
    element: <InternshipsPage />,
  },
  {
    path: PATHS.INTERNSHIPS_OPEN,
    element: <CurrentlyOpenPage />,
  },
  {
    path: PATHS.INTERNSHIPS_REVIEW,
    element: <InternshipReviewPage />,
  },
];
