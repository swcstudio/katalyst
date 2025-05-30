export {};

console.log('Building SOTA Marketing Stack...');

try {
  await Deno.mkdir('dist', { recursive: true });
  
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SOTA Marketing Stack</title>
</head>
<body>
  <h1>SOTA Marketing Stack v1.0.0</h1>
  <p>Built with Deno Runtime and Tanstack SolidJS</p>
</body>
</html>`;
  
  await Deno.writeTextFile('dist/index.html', htmlContent);
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
