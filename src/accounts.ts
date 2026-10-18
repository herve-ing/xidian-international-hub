import { AuthError, AuthErrorCode } from './auth-errors.ts';
import { clubs } from './clubs.ts';
export type AccountRole = 'student' | 'club_leader' | 'professor';
export type Account = {
  id: string;
  role: AccountRole;
  displayName: string;
  email: string;
  studentId: string;
  nationality: string;
  major: string;
  grade: string;
  phone: string;
  clubIds?: string[];
};
type StoredAccount = Account & { salt: string; passwordHash: string };
export const accountsKey = 'xidian-accounts-v1';
export const sessionKey = 'xidian-session-v1';
// Public demonstration code. Production access must be validated on a server.
export const professorDemoCode = 'XIDIAN-PROF-DEMO-2026';
function accounts(): StoredAccount[] {
  try {
    const value = JSON.parse(localStorage.getItem(accountsKey) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
function publicAccount(a: StoredAccount | Account): Account {
  const { id, role, displayName, email, studentId, nationality, major, grade, phone } = a;
  return {
    id,
    role,
    displayName,
    email,
    studentId,
    nationality,
    major,
    grade,
    phone,
    clubIds: Array.isArray(a.clubIds)
      ? a.clubIds.filter((id) => clubs.some((c) => c.id === id))
      : [],
  };
}
// A demo professor must have signed in during this page lifetime. This is not server authentication.
let professorSession: { token: string; account: Account } | null = null;
function setSession(a: Account) {
  const account = publicAccount(a);
  if (a.role === 'professor') {
    if (!professorSession || professorSession.account.id !== a.id)
      throw new AuthError(AuthErrorCode.Session);
    professorSession.account = account;
  } else professorSession = null;
  sessionStorage.setItem(
    sessionKey,
    JSON.stringify({
      ...account,
      ...(a.role === 'professor' ? { demoProof: professorSession!.token } : {}),
    }),
  );
  return account;
}
export function currentAccount(): Account | null {
  try {
    const session = JSON.parse(sessionStorage.getItem(sessionKey) || 'null');
    if (!session || typeof session.id !== 'string') return null;
    if (session.role === 'professor') {
      return professorSession &&
        session.id === professorSession.account.id &&
        session.demoProof === professorSession.token
        ? publicAccount(professorSession.account)
        : null;
    }
    if (session.role !== 'student' && session.role !== 'club_leader') return null;
    const stored = accounts().find((account) => account.id === session.id);
    // A student record cannot turn into a professor via local storage.
    return stored && (stored.role === 'student' || stored.role === 'club_leader')
      ? publicAccount(stored)
      : null;
  } catch {
    return null;
  }
}
export function signOut() {
  professorSession = null;
  sessionStorage.removeItem(sessionKey);
}
function hex(bytes: Uint8Array) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
async function hash(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  return hex(
    new Uint8Array(
      await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: new TextEncoder().encode(salt),
          iterations: 210000,
          hash: 'SHA-256',
        },
        key,
        256,
      ),
    ),
  );
}
export function validateStudent(a: Account) {
  if (
    [a.displayName, a.studentId, a.nationality, a.major, a.grade, a.phone, a.email].some(
      (v) => !v?.trim(),
    )
  )
    throw new AuthError(AuthErrorCode.Required);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) throw new AuthError(AuthErrorCode.Email);
  if (!/^[+\d][\d\s().-]{5,24}$/.test(a.phone)) throw new AuthError(AuthErrorCode.Phone);
  if (!['Bachelor', 'Master', 'PhD', 'Language program'].includes(a.grade))
    throw new AuthError(AuthErrorCode.Grade);
}
export async function registerStudent(input: Omit<Account, 'id' | 'role'>, password: string) {
  const account: Account = {
    ...input,
    id: crypto.randomUUID(),
    role: 'student',
    clubIds: [],
    email: input.email.trim().toLowerCase(),
    studentId: input.studentId.trim().toUpperCase(),
  };
  validateStudent(account);
  if (password.length < 8) throw new AuthError(AuthErrorCode.Password);
  const all = accounts();
  if (all.some((a) => a.email === account.email || a.studentId === account.studentId))
    throw new AuthError(AuthErrorCode.Duplicate);
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  all.push({ ...account, salt, passwordHash: await hash(password, salt) });
  localStorage.setItem(accountsKey, JSON.stringify(all));
  return setSession(account);
}
export async function loginStudent(
  identifier: string,
  password: string,
  portal: 'student' | 'club_leader' = 'student',
) {
  const value = identifier.trim().toLowerCase(),
    a = accounts().find((a) => a.email === value || a.studentId.toLowerCase() === value);
  if (!a || (await hash(password, a.salt)) !== a.passwordHash)
    throw new AuthError(AuthErrorCode.Credentials);
  if (portal === 'club_leader' && (a.role !== 'club_leader' || !a.clubIds?.length))
    throw new AuthError(AuthErrorCode.Leader);
  return setSession(a);
}
export function loginProfessor(displayName: string, email: string, code: string) {
  if (!displayName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    throw new AuthError(AuthErrorCode.Required);
  if (code.trim() !== professorDemoCode) throw new AuthError(AuthErrorCode.ProfessorCode);
  const account: Account = {
    id: 'professor-' + email.trim().toLowerCase(),
    role: 'professor',
    displayName: displayName.trim(),
    email: email.trim().toLowerCase(),
    studentId: '',
    nationality: '',
    major: '',
    grade: '',
    phone: '',
  };
  professorSession = { token: crypto.randomUUID(), account };
  return setSession(account);
}
export function updateAccountProfile(changes: Partial<Account>) {
  const current = currentAccount();
  if (!current) throw new AuthError(AuthErrorCode.Session);
  const next = {
    ...current,
    ...changes,
    id: current.id,
    role: current.role,
    clubIds: current.clubIds,
    email: current.email,
    studentId: current.studentId,
  };
  if (current.role !== 'professor') {
    validateStudent(next);
    const all = accounts().map((a) => (a.id === next.id ? { ...a, ...next } : a));
    localStorage.setItem(accountsKey, JSON.stringify(all));
  }
  return setSession(next);
}
export function studentAccounts() {
  return accounts()
    .filter((a) => a.role === 'student' || a.role === 'club_leader')
    .map(publicAccount);
}
export function canAccessISO(a: Account | null) {
  return a?.role === 'professor';
}
export function workspaceKey(a: Account | null = currentAccount()) {
  return a ? 'xidian-workspace-v1:' + a.id : 'xidian-pages-prototype-v1';
}

export function canManageClubs(a: Account | null) {
  return a?.role === 'professor' || (a?.role === 'club_leader' && !!a.clubIds?.length);
}
export function managedClubIds(a: Account | null) {
  return a?.role === 'professor'
    ? clubs.map((c) => c.id)
    : a?.role === 'club_leader'
      ? a.clubIds || []
      : [];
}
export function assignClubLeadership(accountId: string, clubIds: string[]) {
  if (!canAccessISO(currentAccount())) throw new AuthError(AuthErrorCode.Forbidden);
  if (clubIds.some((id) => !clubs.some((c) => c.id === id)))
    throw new AuthError(AuthErrorCode.Club);
  const all = accounts(),
    index = all.findIndex((a) => a.id === accountId);
  if (index < 0) throw new AuthError(AuthErrorCode.Student);
  all[index] = {
    ...all[index],
    role: clubIds.length ? 'club_leader' : 'student',
    clubIds: [...new Set(clubIds)],
  };
  localStorage.setItem(accountsKey, JSON.stringify(all));
  return publicAccount(all[index]);
}

export function clubLeaderNames(clubId: string) {
  return studentAccounts()
    .filter((a) => a.role === 'club_leader' && a.clubIds?.includes(clubId))
    .map((a) => a.displayName);
}
