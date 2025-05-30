import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const url = new URL(event.node.req.url!, `http://${event.node.req.headers.host}`);
  
  if (url.pathname.startsWith('/api/')) {
    return handleApiRequest(event);
  }
  
  return;
});

async function handleApiRequest(event: any) {
  const url = new URL(event.node.req.url!, `http://${event.node.req.headers.host}`);
  const pathname = url.pathname;
  const method = event.node.req.method;

  if (pathname === '/api/hello') {
    return { message: 'Hello from SOTA Marketing Stack API!' };
  }

  if (pathname === '/api/contact' && method === 'POST') {
    try {
      const formData = await readBody(event);
      console.log('Contact form submission:', formData);
      
      return { success: true, message: 'Form submitted successfully' };
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Failed to process form'
      });
    }
  }

  if (pathname === '/api/subscribe' && method === 'POST') {
    try {
      const formData = await readBody(event);
      console.log('Newsletter subscription:', formData);
      
      return { success: true, message: 'Subscription successful' };
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Failed to process subscription'
      });
    }
  }

  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found'
  });
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
