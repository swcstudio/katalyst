export function mergeConfigs<T extends Record<string, any>>(
  base: T,
  override: Partial<T>
): T {
  return { ...base, ...override };
}

export function validateConfig(config: any): boolean {
  return config && typeof config === 'object';
}

export function normalizePluginName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

export function createPluginId(name: string, version?: string): string {
  const normalized = normalizePluginName(name);
  return version ? `${normalized}@${version}` : normalized;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
