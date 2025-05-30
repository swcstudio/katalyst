export {};

import { serve } from "https://deno.land/std@0.132.0/http/server.ts";

console.log('Starting SOTA Marketing Stack development server...');

try {
  const handler = (_req: Request): Response => {
    return new Response("SOTA Marketing Stack Development Server", {
      headers: { "content-type": "text/plain" },
    });
  };

  console.log('Development server started on port 3000');
  console.log(`HTTP webserver running at http://localhost:3000/`);
  
  await serve(handler, { port: 3000 });
} catch (error) {
  console.error('Development server failed:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
