import type { RouteObject } from 'react-router';
import { PATHS } from '../paths.js';
import ArticlesPage from './pages/ArticlesPage.js';
import ArticleDetailPage from './pages/ArticleDetailPage.js';

export const articlesRoutes: RouteObject[] = [
  {
    path: PATHS.ARTICLES,
    element: <ArticlesPage />,
  },
  {
    path: `${PATHS.ARTICLES}/:id`,
    element: <ArticleDetailPage />,
  },
];
