import type { Account } from './account.ts';

export const canAccessISO = (a: Account | null): boolean => a?.role === 'professor';

export const canManageClubs = (a: Account | null): boolean =>
  a?.role === 'professor' || (a?.role === 'club_leader' && !!a.clubIds?.length);

export function managedClubIds(a: Account | null, allClubIds: string[]): string[] {
  if (a?.role === 'professor') return allClubIds;
  if (a?.role === 'club_leader') return a.clubIds ?? [];
  return [];
}
