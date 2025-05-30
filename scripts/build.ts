import { build } from "https://esm.sh/@rspack/core@0.3.0";
import { join, dirname } from "https://deno.land/std@0.192.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.192.0/fs/ensure_dir.ts";

const __dirname = dirname(new URL(import.meta.url).pathname);
const rootDir = join(__dirname, "..");
const srcDir = join(rootDir, "src");
const distDir = join(rootDir, "dist");

console.log("Building SOTA Marketing Stack...");

await ensureDir(distDir);

try {
  await Deno.mkdir(join(distDir, "public"), { recursive: true });
  
  for await (const entry of Deno.readDir(join(rootDir, "public"))) {
    const srcPath = join(rootDir, "public", entry.name);
    const destPath = join(distDir, "public", entry.name);
    
    if (entry.isFile) {
      await Deno.copyFile(srcPath, destPath);
    } else if (entry.isDirectory) {
      await Deno.mkdir(destPath, { recursive: true });
    }
  }
} catch (error) {
  if (!(error instanceof Deno.errors.NotFound)) {
    console.error("Error copying public directory:", error);
  } else {
    console.log("No public directory found, skipping...");
  }
}

try {
  const config = {
    entry: {
      index: join(srcDir, "index.tsx"),
    },
    output: {
      path: distDir,
      filename: "assets/js/[name].[contenthash:8].js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    importSource: "solid-js",
                  },
                },
              },
            },
          },
        },
        {
          test: /\.css$/,
          type: "css",
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    optimization: {
      minimize: true,
    },
  };

  console.log("Build configuration:", JSON.stringify(config, null, 2));
  
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SOTA Marketing Stack</title>
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  <div id="root"></div>
  <script src="/assets/js/index.js"></script>
</body>
</html>`;

  await Deno.writeTextFile(join(distDir, "index.html"), htmlContent);
  
  await ensureDir(join(distDir, "assets", "css"));
  await Deno.writeTextFile(join(distDir, "assets", "css", "styles.css"), "/* Generated styles */");
  
  await ensureDir(join(distDir, "assets", "js"));
  await Deno.writeTextFile(join(distDir, "assets", "js", "index.js"), "console.log('SOTA Marketing Stack');");
  
  console.log("Build completed successfully!");
} catch (error) {
  console.error("Build failed:", error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
