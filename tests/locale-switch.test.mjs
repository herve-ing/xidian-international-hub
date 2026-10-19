import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  languages,
  defaultLocale,
  normalizeLocale,
  localeDirection,
} from '../src/locale-config.ts';
import { catalogues } from '../src/locale-catalogues.ts';
import { content, translate, localize } from '../src/i18n.ts';
import { answerFAQ } from '../src/faq.ts';
const memory = new Map(),
  events = new Map();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => memory.set(k, v),
    removeItem: (k) => memory.delete(k),
  },
});
Object.defineProperty(globalThis, 'document', {
  configurable: true,
  value: { documentElement: { lang: 'en', dir: 'ltr' } },
});
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: {
    addEventListener: (type, fn) => {
      if (!events.has(type)) events.set(type, new Set());
      events.get(type).add(fn);
    },
    removeEventListener: (type, fn) => events.get(type)?.delete(fn),
  },
});
const { readLocale, setLocale, subscribeLocale } = await import('../src/locale-store.ts');
test('English is the default; every requested language is ordered, normalized and direction-aware', () => {
  memory.clear();
  assert.equal(defaultLocale, 'en');
  assert.equal(readLocale(), 'en');
  assert.deepEqual(
    languages.map(([id]) => id),
    ['en', 'fr', 'zh', 'ar', 'ru', 'es', 'pt', 'tr', 'id', 'ms', 'ur', 'hi', 'ary', 'tk', 'ln'],
  );
  for (const [input, output] of [
    ['pt-BR', 'pt'],
    ['zh-CN', 'zh'],
    ['ur-PK', 'ur'],
    ['hi-IN', 'hi'],
    ['ar-MA', 'ary'],
    ['not-supported', 'en'],
  ])
    assert.equal(normalizeLocale(input), output);
  assert.equal(localeDirection('ur'), 'rtl');
  assert.equal(localeDirection('hi'), 'ltr');
});
test('one locale store updates all subscribers once, persists the choice and restores LTR after RTL', () => {
  memory.clear();
  let first = 0,
    second = 0;
  const off1 = subscribeLocale(() => first++),
    off2 = subscribeLocale(() => second++);
  for (const locale of ['ar', 'ur', 'hi', 'ru', 'fr', 'en']) {
    setLocale(locale);
    assert.equal(readLocale(), locale);
    assert.equal(document.documentElement.lang, locale);
    assert.equal(document.documentElement.dir, localeDirection(locale));
  }
  assert.equal(first, 6);
  assert.equal(second, 6);
  off1();
  setLocale('pt');
  assert.equal(first, 6);
  assert.equal(second, 7);
  memory.set('xidian-locale', 'ms');
  for (const fn of events.get('storage')) fn({ key: 'xidian-locale' });
  assert.equal(readLocale(), 'ms');
  assert.equal(document.documentElement.lang, 'ms');
  off2();
});
test('each shipped locale covers every canonical interface key and FAQ answers exist in all locales', () => {
  const keys = Object.keys(catalogues.en);
  assert.ok(keys.length > 1200);
  for (const [locale] of languages) {
    for (const key of keys) assert.ok(catalogues[locale]?.[key]?.trim(), `${locale}: ${key}`);
    assert.ok(translate(locale, 'home'));
    assert.ok(answerFAQ('visa', locale).answer);
  }
  assert.equal(content('pt', 'Langue', 'Language'), 'Idioma');
  assert.equal(content('hi', 'Langue', 'Language'), 'भाषा');
  assert.equal(localize('pt', 'Idioma'), 'Idioma');
  assert.equal(localize('en', 'Idioma'), 'Language');
  assert.equal(
    localize('ar', 'Unlisted student-authored title'),
    'Unlisted student-authored title',
  );
});

test('a language selection still applies when storage writes fail and an older locale remains readable', () => {
  const original = localStorage.setItem;
  memory.set('xidian-locale', 'fr');
  localStorage.setItem = () => {
    throw new Error('Storage quota reached');
  };
  try {
    setLocale('ur');
    assert.equal(readLocale(), 'ur');
    assert.equal(document.documentElement.dir, 'rtl');
  } finally {
    localStorage.setItem = original;
    setLocale('en');
  }
});
