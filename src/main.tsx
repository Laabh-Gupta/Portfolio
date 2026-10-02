import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import 'lenis/dist/lenis.css';
import './styles.css';
import './responsive.css';
import App from './App';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
const path = window.location.pathname.replace(/\/$/, '') || '/';
// A static host's fallback can serve home HTML for a legacy or unknown URL.
// Hydrate only the matching prerender; React Router handles fallback URLs fresh.
if (root.childElementCount > 0 && (root.dataset.route === path || root.dataset.route === '/404'))
  hydrateRoot(root, app);
else createRoot(root).render(app);
