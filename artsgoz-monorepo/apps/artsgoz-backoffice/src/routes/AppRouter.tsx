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
import { LoginPage } from '../features/auth/LoginPage';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <ProtectedRoute><Navigate to={PATHS.AKSORNSARA} replace /></ProtectedRoute>,
  },
  {
    path: PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: PATHS.DASHBOARD.ROOT,
    element: <ProtectedRoute><AdminDashboardPage /></ProtectedRoute>,
  },
  {
    path: PATHS.ADMIN.ROOT,
    element: <ProtectedRoute><AdminDashboardPage /></ProtectedRoute>,
  },
  {
    path: PATHS.ADMIN.DASHBOARD,
    element: <ProtectedRoute><AdminDashboardPage /></ProtectedRoute>,
  },
  {
    path: PATHS.ADMIN.AUDIT_LOG,
    element: <ProtectedRoute><AdminAuditLogPage /></ProtectedRoute>,
  },
  {
    path: PATHS.ADMIN.REVIEWS,
    element: <ProtectedRoute><AdminReviewsPage /></ProtectedRoute>,
  },
  {
    path: PATHS.ADMIN.USERS,
    element: <ProtectedRoute><AdminUsersPage /></ProtectedRoute>,
  },
  {
    path: PATHS.YELLOW_CARD_BACKOFFICE,
    element: <YellowCardBackofficePage />,
  },
  {
    path: PATHS.AKSORNSARA,
    element: <ProtectedRoute><AksornsaraPage /></ProtectedRoute>,
  },
  {
    path: PATHS.AKSORNSARA_TRAFFIC,
    element: <ProtectedRoute><TrafficPage /></ProtectedRoute>,
  },
  {
    path: PATHS.AKSORNSARA_CATEGORIES,
    element: <ProtectedRoute><CategoriesPage /></ProtectedRoute>,
  },
  {
    path: PATHS.AKSORNSARA_ARTICLES,
    element: <ProtectedRoute><ArticlesPage /></ProtectedRoute>,
  },
  {
    path: PATHS.AKSORNSARA_PUBLISHED_ARTICLES,
    element: <ProtectedRoute><PublishedArticlesPage /></ProtectedRoute>,
  },
  {
    path: PATHS.AKSORNSARA_CREATE,
    element: <ProtectedRoute><CreateArticlePage /></ProtectedRoute>,
  },
  {
    path: PATHS.AKSORNSARA_COMMENTS,
    element: <ProtectedRoute><CommentsPage /></ProtectedRoute>,
  },
  {
    path: PATHS.AKSORNSARA_ACTIVITIES,
    element: <ProtectedRoute><ActivitiesPage /></ProtectedRoute>,
  },
  {
    path: PATHS.AKSORNSARA_SETTINGS,
    element: <ProtectedRoute><AccountSettingsPage /></ProtectedRoute>,
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
