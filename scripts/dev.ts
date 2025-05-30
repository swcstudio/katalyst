import { serve } from "https://deno.land/std@0.220.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.220.0/http/file_server.ts";

console.log('Starting SOTA Marketing Stack development server...');

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  
  if (url.pathname.startsWith('/api/')) {
    if (url.pathname === '/api/hello') {
      return new Response(
        JSON.stringify({ message: 'Hello from SOTA Marketing Stack API!' }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Not Found' }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }
  
  return serveDir(req, {
    fsRoot: "src",
    urlRoot: "",
  });
};

console.log('Server listening on http://localhost:3000');
await serve(handler, { port: 3000 });

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
