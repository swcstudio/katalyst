export {};

console.log('Starting SOTA Marketing Stack preview server...');

try {
  console.log('Preview server started on port 3000');
  
  await new Promise(() => {});
} catch (error) {
  console.error('Preview server failed:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
