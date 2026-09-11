import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WaitlistPage } from './components/WaitlistPage';
import './index.css';

/**
 * swifflyy.com/waitlist — a standalone page, NOT behind the coming-soon gate:
 * it is the link we share while the landing page is still hidden. Two ways
 * in: save a spot with an email, or set up the whole profile at /join/.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WaitlistPage />
  </StrictMode>,
);
