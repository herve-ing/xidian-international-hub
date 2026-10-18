/** Minimal storage port. Browser, memory (tests) or remote implementations. */
export interface KeyValueStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export const fromWebStorage = (storage: Storage): KeyValueStore => ({
  get: (key) => storage.getItem(key),
  set: (key, value) => storage.setItem(key, value),
  remove: (key) => storage.removeItem(key),
});

export function memoryStore(): KeyValueStore {
  const data = new Map<string, string>();
  return {
    get: (key) => data.get(key) ?? null,
    set: (key, value) => void data.set(key, value),
    remove: (key) => void data.delete(key),
  };
}
