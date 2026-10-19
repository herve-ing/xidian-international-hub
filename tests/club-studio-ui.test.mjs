import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const local = new Map(),
  session = new Map();
for (const [name, store] of [
  ['localStorage', local],
  ['sessionStorage', session],
])
  Object.defineProperty(globalThis, name, {
    value: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    },
    configurable: true,
  });
const professor = {
  id: 'p',
  role: 'professor',
  displayName: 'Professor',
  email: 'p@example.com',
  studentId: '',
  nationality: '',
  major: '',
  grade: '',
  phone: '',
};
test('club studio exposes creation only to professors; published text is escaped; clubs use local photos with an original fallback', async () => {
  const server = await createServer({
    root: new URL('..', import.meta.url).pathname,
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  });
  try {
    const { default: Studio } = await server.ssrLoadModule('/src/club-studio.tsx');
    const auth = await server.ssrLoadModule('/src/accounts.ts');
    auth.loginProfessor('Professor', 'p@example.com', auth.professorDemoCode);
    let html = renderToStaticMarkup(React.createElement(Studio, { lang: 'fr', onChange() {} }));
    assert.match(html, /Créer un club/);
    assert.match(html, /Écrire un article/);
    const leader = { ...professor, id: 'leader', role: 'club_leader', clubIds: ['fox'] };
    session.set('xidian-session-v1', JSON.stringify(leader));
    local.set('xidian-accounts-v1', JSON.stringify([leader]));
    html = renderToStaticMarkup(React.createElement(Studio, { lang: 'fr', onChange() {} }));
    assert.doesNotMatch(html, /Créer un club/);
    assert.match(html, /Écrire un article/);
    const { ClubJournal } = await server.ssrLoadModule('/src/club-journal.tsx');
    local.set(
      'xidian-club-articles-v1',
      JSON.stringify([
        {
          id: 'one',
          clubId: 'fox',
          title: '<img src=x onerror=alert(1)>',
          body: '<script>alert(1)</script>',
          authorId: 'leader',
          authorName: 'Leader',
          language: 'fr',
          status: 'published',
          media: [],
          publishedAt: '2026-10-18T10:00Z',
          updatedAt: '2026-10-18T10:00Z',
        },
      ]),
    );
    html = renderToStaticMarkup(React.createElement(ClubJournal, { lang: 'fr' }));
    assert.match(html, /&lt;script&gt;/);
    assert.doesNotMatch(html, /<script>/);
    assert.match(html, /Lire l’article/);
    const { ClubVisual } = await server.ssrLoadModule('/src/club-visual.tsx');
    const { clubs } = await server.ssrLoadModule('/src/clubs.ts');
    for (const club of clubs) {
      html = renderToStaticMarkup(React.createElement(ClubVisual, { club }));
      assert.match(html, /class="club-visual club-photograph"/);
      assert.match(html, /src="\.\/media\//);
      assert.ok(html.includes(club.name));
    }
    html = renderToStaticMarkup(
      React.createElement(ClubVisual, { club: { ...clubs[0], id: 'new-custom-club' } }),
    );
    assert.match(html, /viewBox="0 0 640 360"/);
  } finally {
    await server.close();
  }
});
