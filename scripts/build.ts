import { copy } from "https://deno.land/std@0.220.0/fs/copy.ts";
import { ensureDir } from "https://deno.land/std@0.220.0/fs/ensure_dir.ts";

console.log('Building SOTA Marketing Stack...');

try {
  await ensureDir("dist");
  
  await copy("src", "dist", { overwrite: true });
  
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
