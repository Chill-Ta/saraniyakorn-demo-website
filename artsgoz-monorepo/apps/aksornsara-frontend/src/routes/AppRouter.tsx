import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import MainLayout from '../layouts/MainLayout.js';
import ArticlesPage from './articles/pages/ArticlesPage.js';
import ArticleDetailPage from './articles/pages/ArticleDetailPage.js';
import { PATHS } from './paths.js';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ArticlesPage />,
      },
      {
        path: PATHS.ARTICLES,
        element: <ArticlesPage />,
      },
      {
        path: `${PATHS.ARTICLES}/:id`,
        element: <ArticleDetailPage />,
      },
      {
        path: '*',
        element: <Navigate to={PATHS.ROOT} replace />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;

