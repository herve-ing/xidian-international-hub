import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { languages } from '../src/locale-config.ts';
import { catalogues } from '../src/locale-catalogues.ts';
const memory = new Map();
for (const name of ['localStorage', 'sessionStorage'])
  Object.defineProperty(globalThis, name, {
    configurable: true,
    value: {
      getItem: (k) => memory.get(name + k) ?? null,
      setItem: (k, v) => memory.set(name + k, v),
      removeItem: (k) => memory.delete(name + k),
    },
  });
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: { location: { hash: '#/' } },
});
const escape = (text) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');
test('all public routes render each locale without the old English fallback notice; degree filters retain stable values', async () => {
  const server = await createServer({
    root: new URL('..', import.meta.url).pathname,
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  });
  try {
    const { default: Site } = await server.ssrLoadModule('/src/public-site.tsx');
    const routes = [
      '#/',
      '#/admissions',
      '#/supervisors',
      '#/union?tab=departments',
      '#/union?tab=clubs',
      '#/union?tab=recruitment',
      '#/apply',
      '#/login',
      '#/study',
      '#/study?tab=roadmap',
      '#/study?tab=session',
      '#/study?tab=exchange',
    ];
    const candidates = Object.keys(catalogues.en).filter(
      (key) => key.length > 55 && !/IELTS|Cambridge|TOEFL/.test(key),
    );
    for (const [locale] of languages) {
      localStorage.setItem('xidian-locale', locale);
      for (const route of routes) {
        window.location.hash = route;
        const html = renderToStaticMarkup(React.createElement(Site));
        assert.ok(html.length > 500, locale + route);
        assert.doesNotMatch(html, /New admissions and applicant pages/);
        if (route === '#/supervisors' || route === '#/admissions') {
          assert.match(html, /<option value="Master"/);
          assert.match(html, /<option value="PhD"/);
        }
        if (locale !== 'en')
          for (const key of candidates)
            if (catalogues[locale][key] && catalogues[locale][key] !== key)
              assert.ok(
                !html.includes(escape(key)),
                `${locale} ${route}: English copy remains: ${key.slice(0, 75)}`,
              );
      }
    }
  } finally {
    await server.close();
  }
});
