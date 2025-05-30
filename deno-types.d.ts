declare namespace Deno {
  export interface FileInfo {
    isFile: boolean;
    isDirectory: boolean;
    isSymlink: boolean;
    size: number;
    mtime: Date | null;
    atime: Date | null;
    birthtime: Date | null;
    dev: number | null;
    ino: number | null;
    mode: number | null;
    nlink: number | null;
    uid: number | null;
    gid: number | null;
    rdev: number | null;
    blksize: number | null;
    blocks: number | null;
  }

  export function exit(code?: number): never;
  export const env: {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): boolean;
    toObject(): Record<string, string>;
  };
  export function readTextFile(path: string): Promise<string>;
  export function writeTextFile(path: string, data: string): Promise<void>;
  export function stat(path: string): Promise<FileInfo>;
  export function mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
  export function remove(path: string, options?: { recursive?: boolean }): Promise<void>;
  export function cwd(): string;
  
  export function test(
    nameOrOptions: string | TestDefinition,
    fn?: (t: TestContext) => void | Promise<void>
  ): void;
  
  export interface TestDefinition {
    name: string;
    fn: (t: TestContext) => void | Promise<void>;
    ignore?: boolean;
    only?: boolean;
    sanitizeOps?: boolean;
    sanitizeResources?: boolean;
    sanitizeExit?: boolean;
  }
  
  export interface TestContext {
    name: string;
    step(name: string, fn: (t: TestContext) => void | Promise<void>): Promise<void>;
  }
}

declare namespace process {
  export function exit(code?: number): never;
}

declare namespace JSX {
  interface HTMLAttributes<T> {
    key?: string | number;
    class?: string;
    ref?: any;
    style?: { [key: string]: string | number } | string;
    onClick?: (event: MouseEvent) => void;
    onInput?: (event: InputEvent) => void;
    onChange?: (event: Event) => void;
    onSubmit?: (event: Event) => void;
  }
  
  interface IntrinsicElements {
    div: HTMLAttributes<HTMLDivElement>;
    h1: HTMLAttributes<HTMLHeadingElement>;
    h2: HTMLAttributes<HTMLHeadingElement>;
    h3: HTMLAttributes<HTMLHeadingElement>;
    p: HTMLAttributes<HTMLParagraphElement>;
    span: HTMLAttributes<HTMLSpanElement>;
    button: HTMLAttributes<HTMLButtonElement>;
    input: HTMLAttributes<HTMLInputElement>;
    form: HTMLAttributes<HTMLFormElement>;
    label: HTMLAttributes<HTMLLabelElement>;
    select: HTMLAttributes<HTMLSelectElement>;
    option: HTMLAttributes<HTMLOptionElement>;
    pre: HTMLAttributes<HTMLPreElement>;
    table: HTMLAttributes<HTMLTableElement>;
    thead: HTMLAttributes<HTMLTableSectionElement>;
    tbody: HTMLAttributes<HTMLTableSectionElement>;
    tr: HTMLAttributes<HTMLTableRowElement>;
    th: HTMLAttributes<HTMLTableCellElement>;
    td: HTMLAttributes<HTMLTableCellElement>;
  }
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
