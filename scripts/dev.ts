
console.log('Starting SOTA Marketing Stack development server...');

try {
  const handler = (_req: Request): Response => {
    return new Response("SOTA Marketing Stack Development Server", {
      headers: { "content-type": "text/plain" },
    });
  };

  console.log('Development server started on port 20000');
  console.log(`HTTP webserver running at http://localhost:20000/`);
  
  const server = Deno.serve({ port: 20000 }, handler);
  await server.finished;
} catch (error) {
  console.error('Development server failed:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
