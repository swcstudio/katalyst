import '@testing-library/jest-dom';

window.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));

window.IntersectionObserver = class MockIntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
} as unknown as typeof IntersectionObserver;

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
