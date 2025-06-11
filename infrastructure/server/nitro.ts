import { createApp, defineEventHandler, readBody, toNodeListener } from 'npm:h3@1.10.1';
import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';

const app = createApp();

app.use(
  '/api/hello',
  defineEventHandler(() => {
    return { message: 'Hello from SOTA Marketing Stack API!' };
  })
);

app.use(
  '/api/contact',
  defineEventHandler(async (event) => {
    if (event.node.req.method === 'POST') {
      try {
        const body = await readBody(event);
        console.log('Contact form submission:', body);
        return { success: true, message: 'Form submitted successfully' };
      } catch (error) {
        return { success: false, message: 'Failed to process form', error: String(error) };
      }
    }
    return { error: 'Method not allowed', statusCode: 405 };
  })
);

app.use(
  '/api/subscribe',
  defineEventHandler(async (event) => {
    if (event.node.req.method === 'POST') {
      try {
        const body = await readBody(event);
        console.log('Newsletter subscription:', body);
        return { success: true, message: 'Subscription successful' };
      } catch (error) {
        return { success: false, message: 'Failed to process subscription', error: String(error) };
      }
    }
    return { error: 'Method not allowed', statusCode: 405 };
  })
);

app.use(
  '/**',
  defineEventHandler(() => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SOTA Marketing Stack</title>
    <style>
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        line-height: 1.6;
      }
      h1 { color: #10b981; /* Emerald-500 */ }
    </style>
  </head>
  <body>
    <h1>SOTA Marketing Stack</h1>
    <p>Server is running. This is a fallback page until the SPA is built.</p>
  </body>
  </html>`;
  })
);

console.log('SOTA Marketing Stack server starting...');
await serve(toNodeListener(app), { port: 3000 });

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
