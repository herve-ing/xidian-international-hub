import type { Account, NewStudent, StoredAccount } from '../domain/account.ts';
import { AuthError } from '../domain/errors.ts';
import { canAccessISO } from '../domain/permissions.ts';
import { MIN_PASSWORD_LENGTH, isEmail, validateStudent } from '../domain/validation.ts';
import type { AccountRepository } from '../repositories/account-repository.ts';
import type { KeyValueStore } from '../repositories/key-value-store.ts';
import { hashPassword, randomSalt } from './password.ts';

export const SESSION_KEY = 'xidian-session-v1';

export interface AuthDeps {
  accounts: AccountRepository;
  session: KeyValueStore;
  /** Ids of existing clubs, used to reject unknown ids. */
  clubIds: () => string[];
  /**
   * DEMO ONLY. A shared code cannot protect anything on a static site.
   * TODO(backend): replace with named, revocable invitations checked on the server.
   */
  professorDemoCode: string;
}

export function createAuthService(deps: AuthDeps) {
  const { accounts, session } = deps;

  const toPublic = (a: StoredAccount | Account): Account => {
    const { id, role, displayName, email, studentId, nationality, major, grade, phone } = a;
    const known = new Set(deps.clubIds());
    const clubIds = Array.isArray(a.clubIds) ? a.clubIds.filter((c) => known.has(c)) : [];
    return { id, role, displayName, email, studentId, nationality, major, grade, phone, clubIds };
  };

  const openSession = (a: Account): Account => {
    const account = toPublic(a);
    session.set(SESSION_KEY, JSON.stringify(account));
    return account;
  };

  function currentAccount(): Account | null {
    try {
      const saved = JSON.parse(session.get(SESSION_KEY) ?? 'null') as Account | null;
      if (!saved) return null;
      if (saved.role === 'student' || saved.role === 'club_leader') {
        // Role is re-read from storage: a tampered session cannot grant a role.
        const stored = accounts.findById(saved.id);
        return stored ? toPublic(stored) : null;
      }
      // TODO(backend): the professor role is trusted from the browser session.
      return saved.role === 'professor' && saved.id && saved.email ? toPublic(saved) : null;
    } catch {
      return null;
    }
  }

  const signOut = (): void => session.remove(SESSION_KEY);

  async function registerStudent(input: NewStudent, password: string): Promise<Account> {
    const account: Account = {
      ...input,
      id: crypto.randomUUID(),
      role: 'student',
      clubIds: [],
      email: input.email.trim().toLowerCase(),
      studentId: input.studentId.trim().toUpperCase(),
    };
    validateStudent(account);
    if (password.length < MIN_PASSWORD_LENGTH) throw new AuthError('password');

    const taken = accounts
      .list()
      .some((a) => a.email === account.email || a.studentId === account.studentId);
    if (taken) throw new AuthError('duplicate');

    const salt = randomSalt();
    accounts.add({ ...account, salt, passwordHash: await hashPassword(password, salt) });
    return openSession(account);
  }

  async function loginStudent(
    identifier: string,
    password: string,
    portal: 'student' | 'club_leader' = 'student',
  ): Promise<Account> {
    const stored = accounts.findByIdentifier(identifier);
    if (!stored || (await hashPassword(password, stored.salt)) !== stored.passwordHash) {
      throw new AuthError('credentials');
    }
    if (portal === 'club_leader' && (stored.role !== 'club_leader' || !stored.clubIds?.length)) {
      throw new AuthError('leader');
    }
    return openSession(stored);
  }

  function loginProfessor(displayName: string, email: string, code: string): Account {
    if (!displayName.trim() || !isEmail(email)) throw new AuthError('required');
    if (code.trim() !== deps.professorDemoCode) throw new AuthError('code');
    const normalized = email.trim().toLowerCase();
    return openSession({
      id: `professor-${normalized}`,
      role: 'professor',
      displayName: displayName.trim(),
      email: normalized,
      studentId: '',
      nationality: '',
      major: '',
      grade: '',
      phone: '',
    });
  }

  function updateProfile(changes: Partial<Account>): Account {
    const current = currentAccount();
    if (!current) throw new AuthError('session');
    const next: Account = {
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
      const stored = accounts.findById(next.id);
      if (stored) accounts.replace({ ...stored, ...next });
    }
    return openSession(next);
  }

  const listStudents = (): Account[] =>
    accounts
      .list()
      .filter((a) => a.role === 'student' || a.role === 'club_leader')
      .map(toPublic);

  function assignClubLeadership(accountId: string, clubIds: string[]): Account {
    if (!canAccessISO(currentAccount())) throw new AuthError('forbidden');
    const known = new Set(deps.clubIds());
    if (clubIds.some((id) => !known.has(id))) throw new AuthError('club');
    const stored = accounts.findById(accountId);
    if (!stored) throw new AuthError('student');

    const unique = [...new Set(clubIds)];
    const updated: StoredAccount = {
      ...stored,
      role: unique.length ? 'club_leader' : 'student',
      clubIds: unique,
    };
    accounts.replace(updated);
    return toPublic(updated);
  }

  const clubLeaderNames = (clubId: string): string[] =>
    listStudents()
      .filter((a) => a.role === 'club_leader' && a.clubIds?.includes(clubId))
      .map((a) => a.displayName);

  return {
    currentAccount,
    signOut,
    registerStudent,
    loginStudent,
    loginProfessor,
    updateProfile,
    listStudents,
    assignClubLeadership,
    clubLeaderNames,
  };
}

export type AuthService = ReturnType<typeof createAuthService>;
