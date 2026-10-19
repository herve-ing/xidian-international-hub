import { useEffect, useSyncExternalStore } from 'react';
import {
  defaultLocale,
  localeDirection,
  localeKey,
  normalizeLocale,
  type Locale,
} from './locale-config.ts';
const listeners = new Set<() => void>();
let writeUnavailable = false;
export function readLocale(): Locale {
  if (writeUnavailable && transientLocale) return transientLocale;
  try {
    return normalizeLocale(localStorage.getItem(localeKey));
  } catch {
    return transientLocale || defaultLocale;
  }
}
function updateDocument(locale: Locale) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale;
  document.documentElement.dir = localeDirection(locale);
}
export function setLocale(value: string) {
  const locale = normalizeLocale(value);
  try {
    localStorage.setItem(localeKey, locale);
    writeUnavailable = false;
  } catch {
    writeUnavailable = true;
    /* The selected page still updates if browser storage is unavailable. */
  }
  transientLocale = locale;
  updateDocument(locale);
  for (const listener of listeners) listener();
}
let transientLocale: Locale | undefined;
function snapshot(): Locale {
  if (writeUnavailable && transientLocale) return transientLocale;
  try {
    const stored = localStorage.getItem(localeKey);
    return stored ? normalizeLocale(stored) : transientLocale || defaultLocale;
  } catch {
    return transientLocale || defaultLocale;
  }
}
export function subscribeLocale(listener: () => void) {
  listeners.add(listener);
  const sync = (event: StorageEvent) => {
    if (event.key === localeKey || event.key === null) {
      transientLocale = undefined;
      writeUnavailable = false;
      updateDocument(snapshot());
      listener();
    }
  };
  if (typeof window !== 'undefined' && window.addEventListener)
    window.addEventListener('storage', sync);
  return () => {
    listeners.delete(listener);
    if (typeof window !== 'undefined' && window.removeEventListener)
      window.removeEventListener('storage', sync);
  };
}
export function useLocale(): [Locale, typeof setLocale] {
  const locale = useSyncExternalStore(subscribeLocale, snapshot, readLocale);
  useEffect(() => updateDocument(locale), [locale]);
  return [locale, setLocale];
}
