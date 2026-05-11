const cache = new Map<string, { data: unknown; expiry: number }>();

const DEFAULT_TTL = 5 * 60 * 1000;

export function getCached<T>(key: string): T | null {
  const record = cache.get(key);
  if (!record) return null;
  
  if (Date.now() > record.expiry) {
    cache.delete(key);
    return null;
  }
  
  return record.data as T;
}

export function setCache(key: string, data: unknown, ttl: number = DEFAULT_TTL): void {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl,
  });
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

export function getCacheSize(): number {
  return cache.size;
}
