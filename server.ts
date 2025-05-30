// @ts-nocheck: Using Nitro implementation for Deno runtime
import { createApp, defineEventHandler, toNodeListener, readBody } from 'npm:h3@1.10.1';
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

console.log("SOTA Marketing Stack server starting...");

const app = createApp();

app.use('/api/hello', defineEventHandler(() => {
  return { message: 'Hello from SOTA Marketing Stack API!' };
}));

app.use('/api/contact', defineEventHandler(async (event) => {
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
}));

app.use('/api/subscribe', defineEventHandler(async (event) => {
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
}));
  const url = new URL(req.url);
  
  if (url.pathname.startsWith('/api/')) {
    if (url.pathname === '/api/hello') {
      return new Response(
        JSON.stringify({ message: 'Hello from SOTA Marketing Stack API!' }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    
    if (url.pathname === '/api/contact' && req.method === 'POST') {
      try {
        const formData = await req.json();
        console.log('Contact form submission:', formData);
        
        return new Response(
          JSON.stringify({ success: true, message: 'Form submitted successfully' }),
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (_error) {
        return new Response(
          JSON.stringify({ success: false, message: 'Failed to process form' }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }
    
    if (url.pathname === '/api/subscribe' && req.method === 'POST') {
      try {
        const formData = await req.json();
        console.log('Newsletter subscription:', formData);
        
        return new Response(
          JSON.stringify({ success: true, message: 'Subscription successful' }),
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (_error) {
        return new Response(
          JSON.stringify({ success: false, message: 'Failed to process subscription' }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ error: 'Not Found' }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }
  
app.use('/**', defineEventHandler(() => {
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
}));

await serve(toNodeListener(app), { port: 3000 });

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
