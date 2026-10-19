import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const storage = new Map();
for (const name of ['localStorage', 'sessionStorage'])
  Object.defineProperty(globalThis, name, {
    value: {
      getItem: (k) => storage.get(name + k) ?? null,
      setItem: (k, v) => storage.set(name + k, v),
      removeItem: (k) => storage.delete(name + k),
    },
    configurable: true,
  });
Object.defineProperty(globalThis, 'window', { value: { location: { hash: '#/' } } });
test('public home and directory do not require sign-in; official application steps are distinguished from local tracking', async () => {
  const server = await createServer({
    root: new URL('..', import.meta.url).pathname,
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  });
  try {
    const { default: Site } = await server.ssrLoadModule('/src/public-site.tsx');
    let html = renderToStaticMarkup(React.createElement(Site));
    assert.match(html, /Votre avenir commence à Xidian/);
    assert.match(html, /media\/hub-logo.jpg/);
    assert.match(html, /binary-ribbon/);
    assert.doesNotMatch(html, /type="password"/);
    window.location.hash = '#/supervisors';
    html = renderToStaticMarkup(React.createElement(Site));
    assert.match(html, /Trouvez votre superviseur/);
    assert.match(html, /255/);
    assert.equal((html.match(/class="public-faculty-card"/g) || []).length, 18);
    assert.doesNotMatch(html, /type="password"/);
    window.location.hash = '#/admissions';
    html = renderToStaticMarkup(React.createElement(Site));
    assert.match(html, /calendrier passé/);
    assert.match(html, /master-admissions-2026.pdf/);
    assert.match(html, /doctoral-admissions-2026.pdf/);
    assert.match(html, /xdgjxs.xidian.edu.cn/);
    window.location.hash = '#/apply';
    html = renderToStaticMarkup(React.createElement(Site));
    assert.match(html, /Aucun matricule Xidian nécessaire/);
    assert.doesNotMatch(html, /name="studentId"/);
    window.location.hash = '#/faculty';
    html = renderToStaticMarkup(React.createElement(Site));
    assert.match(html, /Accès professeur|Espace réservé aux superviseurs/);
    assert.doesNotMatch(html, /Suivi des candidatures/);
  } finally {
    await server.close();
  }
});
