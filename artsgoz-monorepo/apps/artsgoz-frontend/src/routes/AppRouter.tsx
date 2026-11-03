import { createBrowserRouter, RouterProvider } from 'react-router';
import MainLayout from '../layouts/MainLayout.js';
import { aboutRoutes } from './about/aboutRoutes.js';
import { homeRoutes } from './home/homeRoutes.js';
import { creditTrackingRoutes } from './credit-tracking/creditTrackingRoutes.js';
import { professorsRoutes } from './professors/professorsRoutes.js';
import { studentServicesRoutes } from './student-services/studentServicesRoutes.js';
import { formsRoutes } from './forms/formsRoutes.js';
import { curriculumRoutes } from './curriculum/curriculumRoutes.js';
import { internshipsRoutes } from './internships/internshipsRoutes.js';
import { articlesRoutes } from './articles/articlesRoutes.js';
import { clubsRoutes } from './clubs/clubsRoutes.js';
import { helpRoutes } from './help/helpRoutes.js';
import NotFoundPage from './not-found/NotFoundPage.js';
import { PATHS } from './paths.js';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <MainLayout />,
    children: [
      ...homeRoutes,
      ...aboutRoutes,
      ...creditTrackingRoutes,
      ...professorsRoutes,
      ...studentServicesRoutes,
      ...formsRoutes,
      ...curriculumRoutes,
      ...internshipsRoutes,
      ...articlesRoutes,
      ...clubsRoutes,
      ...helpRoutes,
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
