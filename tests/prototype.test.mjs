import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prototypeRequest as api } from '../src/prototype-api.ts';
const store = new Map();
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  },
  configurable: true,
});
test('prototype persists documents, checklist and preferences without a server', async () => {
  store.clear();
  let state = await api('/api/state');
  assert.equal(state.documents.length, 0);
  await api('/api/profile', 'PUT', {
    displayName: 'Test student',
    studentId: 'DEMO',
    program: 'Master',
  });
  await api('/api/checklist', 'PUT', { items: [0, 2] });
  await api('/api/preferences', 'PUT', { favorites: ['li-jun'] });
  await api('/api/documents', 'POST', {
    label: 'Test permit',
    type: 'residence',
    expiry: '2020-01-01',
  });
  state = await api('/api/state');
  assert.equal(state.profile.displayName, 'Test student');
  assert.equal(state.documents.length, 1);
  assert.deepEqual(JSON.parse(state.profile.checklist), [0, 2]);
  assert.deepEqual(JSON.parse(state.profile.preferences).favorites, ['li-jun']);
  assert.equal(state.alerts.length, 1);
  state = await api('/api/state');
  assert.equal(state.alerts.length, 1, 'duplicate reminder prevented');
  await api('/api/alerts', 'PATCH');
  state = await api('/api/state');
  assert.equal(state.alerts[0].status, 'read');
  await api('/api/documents', 'DELETE', { id: state.documents[0].id });
  assert.equal((await api('/api/state')).documents.length, 0);
});
test('prototype rejects impossible dates', async () => {
  await assert.rejects(() =>
    api('/api/documents', 'POST', { label: 'Invalid', type: 'passport', expiry: '2026-02-29' }),
  );
});
test('reference assistant returns source-backed FAQ locally', async () => {
  const answer = await api('/api/chatbot', 'POST', {
    question: 'Comment demander mon permis de séjour ?',
    lang: 'fr',
  });
  assert.match(answer.answer, /30 jours/);
  assert.match(answer.source, /nia.gov.cn/);
});
