import { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import { MaintenancePage } from '@base-components';
import App from './app/app.js';
import { IS_MAINTENANCE_MODE } from './config/maintenance.js';

// i18n bootstrap — must be imported before App renders
import './i18n/index.js';

import './styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <Suspense fallback={null}>
      {IS_MAINTENANCE_MODE ? <MaintenancePage /> : <App />}
    </Suspense>
  </StrictMode>,
);
