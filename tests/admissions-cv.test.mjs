import { test } from 'node:test';
import assert from 'node:assert/strict';
import { graduateProgrammes } from '../src/admissions-data.ts';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
test('2026 programme transcription retains distinct degree languages and all guide entries', () => {
  assert.equal(graduateProgrammes.filter((p) => p.level === 'Master').length, 28);
  assert.equal(graduateProgrammes.filter((p) => p.level === 'PhD').length, 21);
  assert.equal(new Set(graduateProgrammes.map((p) => p.level + p.school + p.major)).size, 49);
  const computer = graduateProgrammes.filter(
    (p) =>
      p.school === 'Computer Science and Technology' &&
      p.major === 'Computer Science and Technology',
  );
  assert.equal(computer.find((p) => p.level === 'Master').language, 'ZH/EN');
  assert.equal(computer.find((p) => p.level === 'PhD').language, 'ZH');
  assert.equal(
    graduateProgrammes.find((p) => p.level === 'PhD' && p.school === 'Mathematics and Statistics')
      .language,
    'ZH',
  );
});
test('CV viewer renders all original pages, full-size links and an honest fallback when no document exists', async () => {
  const server = await createServer({
    root: new URL('..', import.meta.url).pathname,
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  });
  try {
    const { SupervisorCV } = await server.ssrLoadModule('/src/supervisor-cv.tsx');
    const profile = {
      name: 'Researcher',
      source: 'https://sie.xidian.edu.cn/profile.htm',
      profileImages: ['https://sie.xidian.edu.cn/one.jpg', 'https://sie.xidian.edu.cn/two.jpg'],
    };
    let html = renderToStaticMarkup(
      React.createElement(SupervisorCV, { supervisor: profile, lang: 'fr' }),
    );
    assert.equal((html.match(/class="official-profile-document"/g) || []).length, 2);
    assert.match(html, /Page 2 \/ 2/);
    assert.match(html, /https:\/\/sie.xidian.edu.cn\/two.jpg/);
    assert.match(html, /referrerPolicy="no-referrer"/);
    html = renderToStaticMarkup(
      React.createElement(SupervisorCV, {
        supervisor: { ...profile, profileImages: [] },
        lang: 'fr',
      }),
    );
    assert.match(html, /Aucune fiche image/);
    assert.match(html, /Consulter la source officielle/);
    assert.doesNotMatch(html, /class="official-profile-document"/);
  } finally {
    await server.close();
  }
});
