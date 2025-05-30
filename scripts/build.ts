export {};

console.log('Building SOTA Marketing Stack...');

try {
  await Deno.mkdir('dist', { recursive: true });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
