import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LocalAccountRepository } from '../src/repositories/account-repository.ts';
import { memoryStore } from '../src/repositories/key-value-store.ts';
import { createAuthService } from '../src/services/auth-service.ts';

const student = {
  displayName: 'Amina Diallo',
  email: 'Amina@Example.com',
  studentId: 'xd2026001',
  nationality: 'Senegal',
  major: 'Software Engineering',
  grade: 'Master',
  phone: '+86 138 0000 0000',
};

function setup() {
  return createAuthService({
    accounts: new LocalAccountRepository(memoryStore()),
    session: memoryStore(),
    clubIds: () => ['math-club', 'badminton'],
    professorDemoCode: 'TEST-CODE',
  });
}

test('register normalizes identifiers and opens a session', async () => {
  const auth = setup();
  const account = await auth.registerStudent(student, 'longpassword');
  assert.equal(account.email, 'amina@example.com');
  assert.equal(account.studentId, 'XD2026001');
  assert.equal(auth.currentAccount()?.id, account.id);
});

test('duplicate email or student id is rejected with a typed error', async () => {
  const auth = setup();
  await auth.registerStudent(student, 'longpassword');
  await assert.rejects(() => auth.registerStudent(student, 'longpassword'), { code: 'duplicate' });
});

test('login fails with a wrong password and works with the student id', async () => {
  const auth = setup();
  await auth.registerStudent(student, 'longpassword');
  auth.signOut();
  await assert.rejects(() => auth.loginStudent('XD2026001', 'wrong-pass'), { code: 'credentials' });
  const ok = await auth.loginStudent('xd2026001', 'longpassword');
  assert.equal(ok.role, 'student');
});

test('a student cannot appoint club leaders; a professor can', async () => {
  const auth = setup();
  const s = await auth.registerStudent(student, 'longpassword');
  assert.throws(() => auth.assignClubLeadership(s.id, ['math-club']), { code: 'forbidden' });

  auth.loginProfessor('Prof. Li', 'li@xidian.edu.cn', 'TEST-CODE');
  const leader = auth.assignClubLeadership(s.id, ['math-club']);
  assert.equal(leader.role, 'club_leader');
  assert.throws(() => auth.assignClubLeadership(s.id, ['unknown']), { code: 'club' });
  assert.equal(auth.assignClubLeadership(s.id, []).role, 'student');
});

test('the professor code is checked', () => {
  const auth = setup();
  assert.throws(() => auth.loginProfessor('Prof. Li', 'li@xidian.edu.cn', 'nope'), { code: 'code' });
});
