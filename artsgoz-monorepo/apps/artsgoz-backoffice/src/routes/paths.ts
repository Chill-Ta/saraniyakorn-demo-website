export const PATHS = {
  ROOT: '/',
  DASHBOARD: {
    ROOT: '/dashboard',
  },
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    AUDIT_LOG: '/admin/audit-log',
    REVIEWS: '/admin/reviews',
  },
  YELLOW_CARD_BACKOFFICE: '/yellow-card/backoffice',
  AKSORNSARA: '/aksornsara',
  AKSORNSARA_TRAFFIC: '/aksornsara/traffic',
  AKSORNSARA_CATEGORIES: '/aksornsara/categories',
  AKSORNSARA_ARTICLES: '/aksornsara/articles',
  AKSORNSARA_PUBLISHED_ARTICLES: '/aksornsara/published-articles',
  AKSORNSARA_CREATE: '/aksornsara/create',
  AKSORNSARA_SETTINGS: '/aksornsara/settings',
  AKSORNSARA_COMMENTS: '/aksornsara/comments',
  AKSORNSARA_ACTIVITIES: '/aksornsara/activities',
  // Backward compatibility aliases
  SARANIYAKORN: '/aksornsara',
  SARANIYAKORN_TRAFFIC: '/aksornsara/traffic',
  SARANIYAKORN_CATEGORIES: '/aksornsara/categories',
  SARANIYAKORN_ARTICLES: '/aksornsara/articles',
  SARANIYAKORN_PUBLISHED_ARTICLES: '/aksornsara/published-articles',
  SARANIYAKORN_CREATE: '/aksornsara/create',
  SARANIYAKORN_SETTINGS: '/aksornsara/settings',
  SARANIYAKORN_COMMENTS: '/aksornsara/comments',
  SARANIYAKORN_ACTIVITIES: '/aksornsara/activities',
} as const;

