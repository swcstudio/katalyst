console.log('SOTA Marketing Stack API server starting...');

export const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  if (url.pathname === '/api/hello') {
    return new Response(JSON.stringify({ message: 'Hello from SOTA Marketing Stack API!' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (url.pathname === '/api/contact' && req.method === 'POST') {
    try {
      const formData = await req.json();
      console.log('Contact form submission:', formData);
      return new Response(
        JSON.stringify({ success: true, message: 'Form submitted successfully' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    } catch (_error) {
      return new Response(JSON.stringify({ success: false, message: 'Failed to process form' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (url.pathname === '/api/subscribe' && req.method === 'POST') {
    try {
      const formData = await req.json();
      console.log('Newsletter subscription:', formData);
      return new Response(JSON.stringify({ success: true, message: 'Subscription successful' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (_error) {
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to process subscription' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
};

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
