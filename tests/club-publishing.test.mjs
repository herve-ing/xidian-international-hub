import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  registerStudent,
  loginStudent,
  loginProfessor,
  professorDemoCode,
  assignClubLeadership,
  currentAccount,
} from '../src/accounts.ts';
import { clubs, reloadClubs, searchClubs } from '../src/clubs.ts';
import {
  createClub,
  saveArticle,
  deleteArticle,
  editableArticles,
  publicArticles,
  validateMedia,
} from '../src/club-publishing.ts';
import { submitEnrollment, ownEnrollments } from '../src/club-enrollments.ts';
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
const student = (id) => ({
  displayName: id,
  studentId: id,
  nationality: 'Example',
  major: 'Science',
  grade: 'Master',
  phone: '+8613800000000',
  email: id + '@example.com',
});
const payload = (clubId) => ({
  clubId,
  title: 'A community story',
  body: 'Text with <script> is plain text, never HTML.',
  language: 'fr',
  status: 'draft',
  media: [],
});
test('professors create durable clubs and appoint students; editorial permissions follow club scope', async () => {
  const studentA = await registerStudent(student('member'), 'DemoPass123');
  assert.throws(
    () =>
      createClub({
        name: 'No',
        description: 'No',
        activity: 'No',
        kit: '',
        zh: '',
        category: 'creative',
      }),
    /forbidden/,
  );
  assert.throws(() => saveArticle(payload('fox')), /forbidden/);
  loginProfessor('Professor', 'prof@example.com', professorDemoCode);
  const club = createClub({
    name: 'International Photography',
    zh: '摄影',
    category: 'creative',
    description: 'Photography for all',
    activity: 'Photo walks',
    kit: 'Any camera',
    leaderId: studentA.id,
  });
  assert.equal(clubs.length, 16);
  reloadClubs();
  assert.ok(clubs.some((c) => c.id === club.id));
  assert.equal(searchClubs('Photography')[0].id, club.id);
  assert.throws(
    () =>
      createClub({
        name: 'International Photography',
        zh: '',
        category: 'creative',
        description: 'x',
        activity: 'x',
        kit: '',
      }),
    /duplicate/,
  );
  const count = clubs.length;
  assert.throws(
    () =>
      createClub({
        name: 'Invalid appointment',
        zh: '',
        category: 'creative',
        description: 'x',
        activity: 'x',
        kit: '',
        leaderId: 'unknown',
      }),
    /student/,
  );
  assert.equal(clubs.length, count);
  await loginStudent('member', 'DemoPass123', 'club_leader');
  assert.ok(currentAccount().clubIds.includes(club.id));
  const draft = saveArticle(payload(club.id));
  assert.equal(publicArticles().length, 0);
  assert.equal(editableArticles().length, 1);
  assert.throws(() => saveArticle(payload('fox')), /forbidden/);
  const published = saveArticle({ ...payload(club.id), id: draft.id, status: 'published' });
  assert.equal(publicArticles(club.id)[0].id, draft.id);
  assert.equal(publicArticles()[0].authorName, 'member');
  assert.ok(published.publishedAt);
  const publishedAt = published.publishedAt;
  const updated = saveArticle({
    ...payload(club.id),
    id: draft.id,
    status: 'published',
    title: 'Updated title',
  });
  assert.equal(updated.publishedAt, publishedAt);
  const other = await registerStudent(student('other'), 'DemoPass123');
  assert.equal(publicArticles().length, 1);
  assert.equal(editableArticles().length, 0);
  assert.throws(() => deleteArticle(draft.id), /forbidden/);
  submitEnrollment({
    clubId: club.id,
    level: 'beginner',
    days: [],
    message: 'Interested',
    consent: true,
    sharePhone: false,
  });
  assert.equal(ownEnrollments()[0].clubId, club.id);
  loginProfessor('Professor', 'prof@example.com', professorDemoCode);
  assignClubLeadership(other.id, ['fox']);
  await loginStudent('other', 'DemoPass123', 'club_leader');
  assert.throws(() => saveArticle({ ...payload('fox'), id: draft.id }), /forbidden/);
  assert.throws(() => deleteArticle(draft.id), /forbidden/);
  loginProfessor('Professor', 'prof@example.com', professorDemoCode);
  saveArticle({ ...payload(club.id), id: draft.id, status: 'draft' });
  assert.equal(publicArticles().length, 0);
  assert.equal(editableArticles().length, 1);
  saveArticle({ ...payload(club.id), id: draft.id, status: 'published' });
  deleteArticle(draft.id);
  assert.equal(publicArticles().length, 0);
  assert.equal(editableArticles().length, 0);
  assignClubLeadership(studentA.id, []);
  await loginStudent('member', 'DemoPass123');
  assert.throws(() => saveArticle(payload(club.id)), /forbidden/);
});
test('media accepts supported images and videos and rejects unsafe formats and excessive sizes', () => {
  validateMedia({ type: 'image/png', size: 1024 });
  validateMedia({ type: 'video/mp4', size: 49 * 1024 * 1024 });
  assert.throws(() => validateMedia({ type: 'image/svg+xml', size: 100 }), /type/);
  assert.throws(() => validateMedia({ type: 'text/html', size: 100 }), /type/);
  assert.throws(() => validateMedia({ type: 'video/mp4', size: 51 * 1024 * 1024 }), /size/);
  assert.throws(() => validateMedia({ type: 'image/jpeg', size: 9 * 1024 * 1024 }), /size/);
});
