globalThis.IntersectionObserver = class MockIntersectionObserver {
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
} as unknown as typeof IntersectionObserver;

if (!globalThis.structuredClone) {
  globalThis.structuredClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  };
}

export const render = (_component: unknown) => {
  return {
    container: { innerHTML: 'mocked-container' },
    getByText: (text: string) => ({ textContent: text }),
    queryByRole: (_role?: string, _options?: Record<string, unknown>) => ({
      textContent: 'mocked-heading',
    }),
  };
};

export const screen = {
  getByText: (text: string) => ({ textContent: text }),
  queryByRole: (_role?: string, _options?: Record<string, unknown>) => ({
    textContent: 'mocked-heading',
  }),
};

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
