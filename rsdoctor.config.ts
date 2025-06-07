import type { RsdoctorConfig } from '@rsdoctor/core';

const config: RsdoctorConfig = {
  features: {
    loader: true,
    plugins: true,
    resolver: true,
    bundle: true,
    treeShaking: true,
    moduleGraph: true,
    duplicatePackages: true,
    bundleSize: true,
    timeline: true,
  },
  reportDir: './dist/rsdoctor',
  port: 20007,
  open: false,
  supports: {
    generateTileGraph: true,
    parseBundle: true,
  },
  linter: {
    rules: {
      'default-import-check': 'error',
      'duplicate-package': 'warn',
      'loader-perf': 'warn',
    },
  },
};

export default config;

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
