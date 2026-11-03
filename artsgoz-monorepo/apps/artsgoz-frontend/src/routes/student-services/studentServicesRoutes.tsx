import type { RouteObject } from 'react-router';
import { PATHS } from '../paths';
import StudentServicesPage from './pages/StudentServicesPage';
import StudentServicesPage2 from './pages/StudentServicesPage2';

export const studentServicesRoutes: RouteObject[] = [
  {
    path: PATHS.STUDENT_SERVICES,
    element: <StudentServicesPage />,
  },
  {
    path: PATHS.STUDENT_SERVICES_2,
    element: <StudentServicesPage2 />,
  },
];

