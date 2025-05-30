declare namespace Deno {
  export function exit(code?: number): never;
  export function env(key: string): string | undefined;
  export function readTextFile(path: string): Promise<string>;
  export function writeTextFile(path: string, data: string): Promise<void>;
  export function stat(path: string): Promise<any>;
  export function mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
  export function remove(path: string, options?: { recursive?: boolean }): Promise<void>;
  export function cwd(): string;
}

declare namespace process {
  export function exit(code?: number): never;
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
