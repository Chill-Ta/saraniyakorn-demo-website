import { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';

// i18n bootstrap — must be imported before App renders
import './i18n/index.js';

import './styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </StrictMode>,
);
