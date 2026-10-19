import { currentAccount, managedClubIds, studentAccounts } from './accounts.ts';
import { hasActiveEnrollment } from './club-enrollments.ts';
export const movieClubId = 'friday-movie-night';
const key = 'xidian-movie-night-v1';
type Phase = 'collecting' | 'voting' | 'closed';
type Proposal = {
  id: string;
  title: string;
  year: string;
  reason: string;
  authorId: string;
  status: 'pending' | 'approved' | 'rejected';
  at: string;
};
type Round = {
  id: string;
  name: string;
  phase: Phase;
  proposals: Proposal[];
  votes: { accountId: string; proposalId: string }[];
  chosenId: string;
  createdAt: string;
};
export class MovieError extends Error {
  code: string;
  constructor(code: string) {
    super(code);
    this.code = code;
    this.name = 'MovieError';
  }
}
function initial(): Round {
  return {
    id: 'friday-first-round',
    name: 'Friday Movie Night',
    phase: 'collecting',
    proposals: [],
    votes: [],
    chosenId: '',
    createdAt: '2026-10-19T00:00:00Z',
  };
}
function read(): Round[] {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    if (
      Array.isArray(data) &&
      data.length &&
      data.every(
        (r) =>
          r &&
          typeof r.id === 'string' &&
          typeof r.name === 'string' &&
          ['collecting', 'voting', 'closed'].includes(r.phase) &&
          Array.isArray(r.proposals) &&
          Array.isArray(r.votes),
      )
    )
      return data.map((r) => ({
        ...r,
        chosenId: typeof r.chosenId === 'string' ? r.chosenId : '',
        proposals: r.proposals.filter(
          (p: any) =>
            p &&
            typeof p.id === 'string' &&
            typeof p.title === 'string' &&
            typeof p.year === 'string' &&
            typeof p.reason === 'string' &&
            typeof p.authorId === 'string' &&
            ['pending', 'approved', 'rejected'].includes(p.status),
        ),
        votes: r.votes.filter(
          (v: any) => v && typeof v.accountId === 'string' && typeof v.proposalId === 'string',
        ),
      }));
  } catch {}
  return [initial()];
}
function write(rounds: Round[]) {
  localStorage.setItem(key, JSON.stringify(rounds));
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function')
    window.dispatchEvent(new Event('xidian-movies'));
}
export function movieManager() {
  return managedClubIds(currentAccount()).includes(movieClubId);
}
export function movieMember() {
  const a = currentAccount();
  return (
    !!a && ['student', 'club_leader'].includes(a.role) && hasActiveEnrollment(a.id, movieClubId)
  );
}
function participant() {
  const a = currentAccount();
  if (!a) throw new MovieError('signin');
  if (!movieMember()) throw new MovieError('member');
  return a;
}
function manager() {
  if (!movieManager()) throw new MovieError('manager');
}
function mutate(fn: (round: Round) => void) {
  const rounds = read();
  fn(rounds[0]);
  write(rounds);
}
function normalized(s: string) {
  return s.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}
export function movieBoard() {
  const a = currentAccount(),
    rounds = read(),
    r = rounds[0],
    canManage = movieManager(),
    known = new Set(studentAccounts().map((x) => x.id));
  const unique = new Map<string, string>();
  for (const v of r.votes)
    if (
      (r.phase === 'closed' ||
        (known.has(v.accountId) && hasActiveEnrollment(v.accountId, movieClubId))) &&
      r.proposals.some((p) => p.id === v.proposalId && p.status === 'approved')
    )
      unique.set(v.accountId, v.proposalId);
  const visible = r.proposals.filter(
    (p) => p.status === 'approved' || canManage || p.authorId === a?.id,
  );
  return {
    id: r.id,
    name: r.name,
    phase: r.phase,
    canManage,
    canParticipate: movieMember(),
    vote: unique.get(a?.id || '') || '',
    totalVotes: unique.size,
    chosenId: r.chosenId,
    proposals: visible.map((p) => ({
      id: p.id,
      title: p.title,
      year: p.year,
      reason: p.reason,
      status: p.status,
      mine: p.authorId === a?.id,
      votes: [...unique.values()].filter((id) => id === p.id).length,
    })),
    history: rounds.slice(1).map((p) => ({
      id: p.id,
      name: p.name,
      title: p.proposals.find((x) => x.id === p.chosenId)?.title || '',
    })),
  };
}
export function proposeMovie(input: { title: string; year: string; reason: string }) {
  const a = participant();
  mutate((r) => {
    if (r.phase !== 'collecting') throw new MovieError('phase');
    const title = input.title.trim(),
      year = input.year.trim(),
      reason = input.reason.trim();
    if (
      !title ||
      title.length > 120 ||
      reason.length > 800 ||
      (year && !/^(18|19|20|21)\d{2}$/.test(year))
    )
      throw new MovieError('invalid');
    if (r.proposals.some((p) => normalized(p.title) === normalized(title) && p.year === year))
      throw new MovieError('duplicate');
    if (r.proposals.filter((p) => p.authorId === a.id).length >= 5 || r.proposals.length >= 100)
      throw new MovieError('limit');
    r.proposals.push({
      id: crypto.randomUUID(),
      title,
      year,
      reason,
      authorId: a.id,
      status: 'pending',
      at: new Date().toISOString(),
    });
  });
}
export function moderateMovie(id: string, status: 'approved' | 'rejected') {
  manager();
  if (!['approved', 'rejected'].includes(status)) throw new MovieError('invalid');
  mutate((r) => {
    if (r.phase !== 'collecting') throw new MovieError('phase');
    const p = r.proposals.find((x) => x.id === id);
    if (!p) throw new MovieError('proposal');
    p.status = status;
  });
}
export function setMoviePhase(phase: 'voting' | 'closed') {
  manager();
  mutate((r) => {
    if (phase === 'voting') {
      if (r.phase !== 'collecting') throw new MovieError('phase');
      if (!r.proposals.some((p) => p.status === 'approved')) throw new MovieError('empty');
    } else if (phase !== 'closed' || r.phase === 'closed') throw new MovieError('phase');
    if (phase === 'closed')
      r.votes = r.votes.filter(
        (v) =>
          hasActiveEnrollment(v.accountId, movieClubId) &&
          studentAccounts().some((a) => a.id === v.accountId),
      );
    r.phase = phase;
  });
}
export function voteMovie(id: string) {
  const a = participant();
  mutate((r) => {
    if (r.phase !== 'voting') throw new MovieError('phase');
    if (!r.proposals.some((p) => p.id === id && p.status === 'approved'))
      throw new MovieError('proposal');
    r.votes = r.votes.filter((v) => v.accountId !== a.id);
    r.votes.push({ accountId: a.id, proposalId: id });
  });
}
export function chooseMovie(id: string) {
  manager();
  mutate((r) => {
    if (r.phase !== 'closed') throw new MovieError('phase');
    if (!r.proposals.some((p) => p.id === id && p.status === 'approved'))
      throw new MovieError('proposal');
    r.chosenId = id;
  });
}
export function newMovieRound(name: string) {
  manager();
  const rounds = read();
  if (rounds[0].phase !== 'closed') throw new MovieError('phase');
  if (!name.trim() || name.length > 100) throw new MovieError('invalid');
  rounds.unshift({
    ...initial(),
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
  });
  write(rounds.slice(0, 12));
}
