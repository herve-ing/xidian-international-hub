import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  registerStudent,
  loginStudent,
  loginProfessor,
  signOut,
  assignClubLeadership,
  professorDemoCode,
} from '../src/accounts.ts';
import { submitEnrollment, cancelEnrollment, ownEnrollments } from '../src/club-enrollments.ts';
import {
  movieClubId,
  movieBoard,
  proposeMovie,
  moderateMovie,
  setMoviePhase,
  voteMovie,
  chooseMovie,
  newMovieRound,
} from '../src/movie-night.ts';
import { saveArticle } from '../src/club-publishing.ts';
import { toggleArticleLike, articleReaction, articleShare } from '../src/club-interactions.ts';
const local = new Map(),
  session = new Map();
for (const [name, map] of [
  ['localStorage', local],
  ['sessionStorage', session],
])
  Object.defineProperty(globalThis, name, {
    value: {
      getItem: (k) => map.get(k) ?? null,
      setItem: (k, v) => map.set(k, v),
      removeItem: (k) => map.delete(k),
    },
    configurable: true,
  });
const profile = (id) => ({
  displayName: 'Student ' + id,
  studentId: id,
  nationality: 'Example',
  major: 'Science',
  grade: 'Master',
  phone: '+8613800000000',
  email: id + '@example.com',
});
const password = 'DemoPass123';
const enroll = () =>
  submitEnrollment({
    clubId: movieClubId,
    level: 'beginner',
    days: [],
    message: 'Demo',
    sharePhone: false,
    consent: true,
  });
const professor = () => loginProfessor('Professor', 'prof@example.com', professorDemoCode);
test('movie proposals require membership; moderation is scoped; one changeable vote; closed rounds are frozen and archived', async () => {
  const a = await registerStudent(profile('cine-a'), password);
  assert.throws(() => proposeMovie({ title: 'One', year: '2020', reason: 'A' }), /member/);
  enroll();
  proposeMovie({ title: 'One', year: '2020', reason: 'A' });
  const one = movieBoard().proposals[0].id;
  assert.throws(() => proposeMovie({ title: ' ONE ', year: '2020', reason: 'A' }), /duplicate/);
  signOut();
  assert.equal(movieBoard().proposals.length, 0);
  assert.throws(() => voteMovie(one), /signin/);
  const b = await registerStudent(profile('cine-b'), password);
  enroll();
  proposeMovie({ title: 'Two', year: '2021', reason: 'B' });
  const two = movieBoard().proposals[0].id;
  assert.equal(movieBoard().proposals.length, 1);
  assert.throws(() => moderateMovie(one, 'approved'), /manager/);
  professor();
  assignClubLeadership(b.id, ['basketball']);
  await loginStudent('cine-b@example.com', password);
  assert.throws(() => moderateMovie(one, 'approved'), /manager/);
  professor();
  assert.throws(() => setMoviePhase('voting'), /empty/);
  moderateMovie(one, 'approved');
  moderateMovie(two, 'approved');
  setMoviePhase('voting');
  await loginStudent('cine-a@example.com', password);
  voteMovie(one);
  voteMovie(one);
  assert.equal(movieBoard().totalVotes, 1);
  voteMovie(two);
  assert.equal(movieBoard().totalVotes, 1);
  assert.equal(movieBoard().proposals.find((p) => p.id === one).votes, 0);
  assert.equal(movieBoard().vote, two);
  cancelEnrollment(ownEnrollments()[0].id);
  assert.equal(movieBoard().totalVotes, 0);
  assert.throws(() => voteMovie(one), /member/);
  await loginStudent('cine-b@example.com', password);
  voteMovie(two);
  assert.throws(() => proposeMovie({ title: 'Late', year: '', reason: '' }), /phase/);
  professor();
  assert.throws(() => moderateMovie(one, 'rejected'), /phase/);
  setMoviePhase('closed');
  chooseMovie(two);
  assert.equal(movieBoard().totalVotes, 1);
  await loginStudent('cine-b@example.com', password);
  cancelEnrollment(ownEnrollments()[0].id);
  assert.equal(movieBoard().totalVotes, 1);
  assert.throws(() => voteMovie(one), /member/);
  professor();
  newMovieRound('Next session');
  assert.equal(movieBoard().phase, 'collecting');
  assert.equal(movieBoard().totalVotes, 0);
  assert.equal(movieBoard().history[0].title, 'Two');
  assignClubLeadership(a.id, [movieClubId]);
  await loginStudent('cine-a@example.com', password);
  assert.equal(movieBoard().canManage, true);
  assert.equal(movieBoard().canParticipate, false);
});
test('students cannot publish; likes toggle per account; only published articles can be shared or liked', async () => {
  professor();
  const post = {
    clubId: movieClubId,
    title: 'Movie news',
    body: 'A public story',
    language: 'en',
    status: 'published',
    media: [],
  };
  const published = saveArticle(post),
    draft = saveArticle({ ...post, title: 'Draft', status: 'draft' });
  signOut();
  assert.throws(() => toggleArticleLike(published.id), /signin/);
  assert.throws(() => articleShare(draft.id, 'https://example.org/'), /article/);
  await loginStudent('cine-b@example.com', password);
  assert.throws(() => saveArticle({ ...post, id: published.id }), /forbidden/);
  assert.throws(() => toggleArticleLike(draft.id), /article/);
  assert.equal(toggleArticleLike(published.id).count, 1);
  assert.equal(toggleArticleLike(published.id).count, 0);
  toggleArticleLike(published.id);
  await registerStudent(profile('cine-c'), password);
  assert.equal(articleReaction(published.id).liked, false);
  assert.equal(toggleArticleLike(published.id).count, 2);
  const shared = articleShare(published.id, 'https://example.org/hub/#/union');
  assert.match(shared.url, new RegExp('article=' + published.id));
  assert.match(shared.text, /A public story/);
  assert.match(shared.text, /Local prototype/);
});
