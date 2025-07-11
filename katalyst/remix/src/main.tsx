import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RemixBrowser } from '@remix-run/react';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RemixBrowser />
  </StrictMode>
);
