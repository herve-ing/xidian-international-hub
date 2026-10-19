import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  registerApplicant,
  loginStudent,
  loginProfessor,
  professorDemoCode,
  assignClubLeadership,
  currentAccount,
  signOut,
} from '../src/accounts.ts';
import {
  saveApplication,
  myApplication,
  ownThreads,
  startThread,
  replyToThread,
  linkFacultyProfile,
  applicantOverview,
} from '../src/repositories/application-repository.ts';
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
const candidate = (id) => ({
  displayName: 'Candidate ' + id,
  email: id + '@example.com',
  studentId: '',
  nationality: 'Example',
  major: 'Computer science',
  grade: 'Master',
  phone: '+8613800000000',
});
test('future applicants need no student ID and have isolated self-reported dossiers and supervisor messages', async () => {
  const alice = await registerApplicant(candidate('alice'), 'DemoPass123');
  assert.equal(alice.role, 'applicant');
  assert.equal(alice.studentId, '');
  assert.throws(() => linkFacultyProfile('li-jun'), /forbidden/);
  assert.throws(() => applicantOverview(), /forbidden/);
  const app = saveApplication({
    level: 'Master',
    major: 'Computer science',
    language: 'English',
    topic: 'Research plan',
    reference: 'DEMO-REF',
    stage: 'preparing',
    documents: ['plan', 'language'],
  });
  assert.equal(app.history.length, 1);
  const advanced = saveApplication({ ...app, stage: 'interview' });
  assert.equal(advanced.history.length, 2);
  assert.equal(myApplication().stage, 'interview');
  assert.throws(() => saveApplication({ ...app, stage: 'invented' }), /invalid/);
  const thread = startThread('li-jun', 'Research topic', 'Please discuss this proposal.');
  assert.equal(ownThreads().length, 1);
  assert.throws(() => startThread('invalid', 'Subject', 'Body'), /supervisor/);
  await registerApplicant(candidate('bob'), 'DemoPass123');
  assert.equal(myApplication(), null);
  assert.equal(ownThreads().length, 0);
  assert.throws(() => replyToThread(thread.id, 'I should not see this'), /forbidden/);
  loginProfessor('Professor', 'prof@example.com', professorDemoCode);
  assert.equal(applicantOverview().length, 1);
  assert.throws(() => assignClubLeadership(alice.id, ['basketball']), /student/);
  linkFacultyProfile('li-jun');
  assert.equal(ownThreads()[0].id, thread.id);
  replyToThread(thread.id, 'Please refine the research question.');
  loginProfessor('Another professor', 'other@example.com', professorDemoCode);
  linkFacultyProfile('li-chenxi');
  assert.equal(ownThreads().length, 0);
  assert.throws(() => replyToThread(thread.id, 'Wrong profile'), /forbidden/);
  assert.throws(() => linkFacultyProfile('li-jun'), /claimed/);
  signOut();
  await loginStudent('alice@example.com', 'DemoPass123');
  assert.equal(currentAccount().role, 'applicant');
  assert.equal(ownThreads()[0].messages.length, 2);
  assert.match(ownThreads()[0].messages[1].body, /refine/);
  assert.equal(myApplication().reference, 'DEMO-REF');
});
