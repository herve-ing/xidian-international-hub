import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clubs, searchClubs, migrateCampus, sessionCalendar } from '../src/clubs.ts';
test('all 13 community clubs are present once and searches cover French, English, Chinese and common spelling', () => {
  assert.equal(clubs.length, 13);
  assert.equal(new Set(clubs.map((c) => c.id)).size, 13);
  assert.deepEqual(
    clubs.map((c) => c.id),
    [
      'basketball',
      'badminton',
      'volleyball',
      'tennis',
      'pickleball',
      'football',
      'boxing',
      'open-canvas',
      'singing',
      'street-dance',
      'chinese-dance',
      'fox',
      'math',
    ],
  );
  assert.equal(searchClubs('', 'sport').length, 7);
  assert.equal(searchClubs('', 'creative').length, 5);
  assert.equal(searchClubs('', 'academic').length, 1);
  assert.equal(searchClubs('', 'all', 'racket').length, 3);
  for (const q of ['mathématiques', 'mathematiques', '数学'])
    assert.equal(searchClubs(q)[0].id, 'math');
  assert.equal(searchClubs('pickeball')[0].id, 'pickleball');
  assert.equal(searchClubs('FOX')[0].id, 'fox');
  assert.equal(searchClubs('football', 'creative').length, 0);
});
test('migration removes obsolete fictional memberships/events while retaining personal proposals and valid current drafts', () => {
  const p = { id: 'idea', name: 'New club', description: 'A local proposal' };
  const state = migrateCampus({
    saved: ['sport', 'basketball', 'basketball'],
    joined: ['sport'],
    registered: ['welcome'],
    proposals: [p],
    drafts: [{ clubId: 'fox', level: 'beginner', days: ['0'], message: 'Hello', status: 'draft' }],
    sessions: [{ id: 'bad', clubId: 'fox', date: '2026-02-30', time: '25:10', duration: 60 }],
  });
  assert.deepEqual(state.saved, ['basketball']);
  assert.equal(state.sessions.length, 0);
  assert.equal(state.drafts.length, 1);
  assert.deepEqual(state.proposals, [p]);
  assert.equal(state.joined, undefined);
});
test('personal visit calendar uses Beijing time, a tentative status and reminder without inventing a confirmed event', () => {
  const e = {
    id: 'visit',
    clubId: 'fox',
    date: '2026-12-04',
    time: '18:30',
    duration: 90,
    note: 'Bring ideas; ask, first',
  };
  const ics = sessionCalendar(
    e,
    'To confirm — FOX',
    'Personal plan',
    new Date('2026-10-18T12:00Z'),
  );
  assert.match(ics, /DTSTART:20261204T103000Z/);
  assert.match(ics, /DTEND:20261204T120000Z/);
  assert.match(ics, /STATUS:TENTATIVE/);
  assert.match(ics, /TRIGGER:-P1D/);
  assert.match(ics, /Bring ideas\\; ask\\, first/);
  assert.throws(() => sessionCalendar({ ...e, date: '2026-02-30' }, 'FOX', 'Plan'), /Invalid date/);
});
