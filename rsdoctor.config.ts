export default {
  port: 20007,
  open: false,
  features: {
    bundleAnalyzer: true,
    treeShaking: true,
    duplicatePackages: true,
    moduleAnalyzer: true,
    loaderAnalyzer: true,
    pluginAnalyzer: true,
    resolver: true,
    compilation: true,
  },
  frameworks: ['marketing', 'blog', 'storefront', 'docs', 'remix-app', 'sveltekit-spa'],
  analysis: {
    performance: true,
    bundleSize: true,
    chunkSplit: true,
    assetOptimization: true,
  },
};

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
