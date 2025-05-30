import '@testing-library/jest-dom';

globalThis.describe = function(name: string, fn: () => void) {
  console.log(`Test suite: ${name}`);
  try {
    fn();
  } catch (error) {
    console.error(`Test suite "${name}" failed:`, error);
  }
};

globalThis.it = globalThis.test = function(name: string, fn: () => void | Promise<void>) {
  try {
    Deno.test(name, fn);
  } catch (e) {
    console.log(`Running test: ${name}`);
    fn();
  }
};

globalThis.expect = function(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
      return true;
    },
    toEqual: (expected: any) => {
      const actualStr = JSON.stringify(actual);
      const expectedStr = JSON.stringify(expected);
      if (actualStr !== expectedStr) {
        throw new Error(`Expected ${expectedStr} but got ${actualStr}`);
      }
      return true;
    },
    toBeTruthy: () => {
      if (!actual) {
        throw new Error(`Expected ${actual} to be truthy`);
      }
      return true;
    },
    toBeInTheDocument: () => {
      if (!actual) {
        throw new Error('Expected element to be in the document');
      }
      return true;
    }
  };
};

globalThis.structuredClone = (obj: any) => JSON.stringify(obj) ? JSON.parse(JSON.stringify(obj)) : obj;

globalThis.IntersectionObserver = class MockIntersectionObserver {
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
