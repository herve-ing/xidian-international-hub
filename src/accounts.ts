// Compatibility facade for existing UI and browser data. The service comes from the supplied refactor.
import { auth } from './app/container.ts';
import { clubs } from './clubs.ts';
import type { Account } from './domain/account.ts';
export type { Account, AccountRole } from './domain/account.ts';
export { validateStudent } from './domain/validation.ts';
export { canAccessISO, canManageClubs } from './domain/permissions.ts';
export const accountsKey = 'xidian-accounts-v1';
export const sessionKey = 'xidian-session-v1';
export const professorDemoCode = 'XIDIAN-PROF-DEMO-2026';
export const currentAccount = auth.currentAccount;
export const signOut = auth.signOut;
export const registerStudent = auth.registerStudent;
export const registerApplicant = auth.registerApplicant;
export const loginStudent = auth.loginStudent;
export const loginProfessor = auth.loginProfessor;
export const updateAccountProfile = auth.updateProfile;
export const studentAccounts = auth.listStudents;
export const assignClubLeadership = auth.assignClubLeadership;
export const clubLeaderNames = auth.clubLeaderNames;
export function workspaceKey(account: Account | null = currentAccount()) {
  return account ? 'xidian-workspace-v1:' + account.id : 'xidian-pages-prototype-v1';
}
export function managedClubIds(account: Account | null) {
  return account?.role === 'professor'
    ? clubs.map((c) => c.id)
    : account?.role === 'club_leader'
      ? account.clubIds || []
      : [];
}
