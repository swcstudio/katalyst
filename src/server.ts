import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.192.0/http/file_server.ts";
import { join } from "https://deno.land/std@0.192.0/path/mod.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3000");
const DIST_DIR = join(Deno.cwd(), "dist");

console.log(`SOTA Marketing Stack server starting on http://localhost:${PORT}`);

const isDev = Deno.args.includes("--dev");

await serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname.startsWith("/api/")) {
    return handleApiRequest(req);
  }

  return serveDir(req, {
    fsRoot: DIST_DIR,
    urlRoot: "",
    showDirListing: false,
    enableCors: true,
  });
}, { port: PORT });

async function handleApiRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname === "/api/hello") {
    return new Response(
      JSON.stringify({ message: "Hello from SOTA Marketing Stack API!" }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  if (pathname === "/api/contact" && req.method === "POST") {
    try {
      const formData = await req.json();
      console.log("Contact form submission:", formData);
      
      return new Response(
        JSON.stringify({ success: true, message: "Form submitted successfully" }),
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to process form" }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }
  }

  if (pathname === "/api/subscribe" && req.method === "POST") {
    try {
      const formData = await req.json();
      console.log("Newsletter subscription:", formData);
      
      return new Response(
        JSON.stringify({ success: true, message: "Subscription successful" }),
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to process subscription" }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }
  }

  return new Response("Not Found", { status: 404 });
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
