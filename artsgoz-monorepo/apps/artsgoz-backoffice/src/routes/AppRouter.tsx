import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { PATHS } from './paths';
import YellowCardBackofficePage from '../features/yellow-card/YellowCardBackofficePage';
import AksornsaraPage from '../features/aksornsara/AksornsaraPage';
import TrafficPage from '../features/aksornsara/TrafficPage';
import CategoriesPage from '../features/aksornsara/CategoriesPage';
import { ArticlesPage } from '../features/aksornsara/ArticlesPage';
import { PublishedArticlesPage } from '../features/aksornsara/PublishedArticlesPage';
import { CreateArticlePage } from '../features/aksornsara/CreateArticlePage';
import CommentsPage from '../features/aksornsara/CommentsPage';
import ActivitiesPage from '../features/aksornsara/ActivitiesPage';
import { AccountSettingsPage } from '../features/aksornsara/AccountSettingsPage';
import { AdminDashboardPage } from '../features/goz-admin/AdminDashboardPage';
import { AdminAuditLogPage } from '../features/goz-admin/AdminAuditLogPage';
import { AdminReviewsPage } from '../features/goz-admin/AdminReviewsPage';
import { AdminUsersPage } from '../features/goz-admin/AdminUsersPage';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <Navigate to={PATHS.AKSORNSARA} replace />,
  },
  {
    path: PATHS.DASHBOARD.ROOT,
    element: <AdminDashboardPage />,
  },
  {
    path: PATHS.ADMIN.ROOT,
    element: <AdminDashboardPage />,
  },
  {
    path: PATHS.ADMIN.DASHBOARD,
    element: <AdminDashboardPage />,
  },
  {
    path: PATHS.ADMIN.AUDIT_LOG,
    element: <AdminAuditLogPage />,
  },
  {
    path: PATHS.ADMIN.REVIEWS,
    element: <AdminReviewsPage />,
  },
  {
    path: PATHS.ADMIN.USERS,
    element: <AdminUsersPage />,
  },
  {
    path: PATHS.YELLOW_CARD_BACKOFFICE,
    element: <YellowCardBackofficePage />,
  },
  {
    path: PATHS.AKSORNSARA,
    element: <AksornsaraPage />,
  },
  {
    path: PATHS.AKSORNSARA_TRAFFIC,
    element: <TrafficPage />,
  },
  {
    path: PATHS.AKSORNSARA_CATEGORIES,
    element: <CategoriesPage />,
  },
  {
    path: PATHS.AKSORNSARA_ARTICLES,
    element: <ArticlesPage />,
  },
  {
    path: PATHS.AKSORNSARA_PUBLISHED_ARTICLES,
    element: <PublishedArticlesPage />,
  },
  {
    path: PATHS.AKSORNSARA_CREATE,
    element: <CreateArticlePage />,
  },
  {
    path: PATHS.AKSORNSARA_COMMENTS,
    element: <CommentsPage />,
  },
  {
    path: PATHS.AKSORNSARA_ACTIVITIES,
    element: <ActivitiesPage />,
  },
  {
    path: PATHS.AKSORNSARA_SETTINGS,
    element: <AccountSettingsPage />,
  },
  // Legacy /saraniyakorn route aliases redirecting to /aksornsara
  {
    path: '/saraniyakorn',
    element: <Navigate to={PATHS.AKSORNSARA} replace />,
  },
  {
    path: '/saraniyakorn/*',
    element: <Navigate to={PATHS.AKSORNSARA} replace />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
