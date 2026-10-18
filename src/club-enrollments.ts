import { clubs } from './clubs.ts';
import { currentAccount, managedClubIds, studentAccounts, type Account } from './accounts.ts';
export type EnrollmentStatus = 'pending' | 'approved' | 'declined' | 'cancelled';
export type Enrollment = {
  id: string;
  clubId: string;
  accountId: string;
  level: string;
  days: string[];
  message: string;
  sharePhone: boolean;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
  reviewNote: string;
  history: { status: EnrollmentStatus; at: string; actorId: string }[];
  applicant?: {
    displayName: string;
    studentId: string;
    email: string;
    major: string;
    grade: string;
    phone: string;
  };
};
export type EnrollmentView = Enrollment & {
  student: {
    displayName: string;
    studentId: string;
    email: string;
    major: string;
    grade: string;
    phone: string;
  };
};
export const enrollmentKey = 'xidian-club-enrollments-v1';
function read(): Enrollment[] {
  try {
    const s = JSON.parse(localStorage.getItem(enrollmentKey) || '[]');
    return Array.isArray(s)
      ? s.filter(
          (e) =>
            e &&
            typeof e.id === 'string' &&
            typeof e.accountId === 'string' &&
            clubs.some((c) => c.id === e.clubId) &&
            ['pending', 'approved', 'declined', 'cancelled'].includes(e.status) &&
            Array.isArray(e.history),
        )
      : [];
  } catch {
    return [];
  }
}
function write(items: Enrollment[]) {
  localStorage.setItem(enrollmentKey, JSON.stringify(items));
}
function signedIn() {
  const a = currentAccount();
  if (!a) throw new Error('signin');
  return a;
}
export function ownEnrollments() {
  const a = currentAccount();
  return a ? read().filter((e) => e.accountId === a.id) : [];
}
export function submitEnrollment(input: {
  clubId: string;
  level: string;
  days: string[];
  message: string;
  sharePhone: boolean;
  consent: boolean;
}) {
  const a = signedIn();
  if (a.role === 'club_leader' && a.clubIds?.includes(input.clubId)) throw new Error('ownclub');
  if (!clubs.some((c) => c.id === input.clubId)) throw new Error('club');
  if (!input.consent) throw new Error('consent');
  if (
    !['beginner', 'intermediate', 'advanced'].includes(input.level) ||
    !Array.isArray(input.days) ||
    input.days.some((d) => !/^[0-6]$/.test(d)) ||
    input.message.length > 800
  )
    throw new Error('invalid');
  const all = read(),
    index = all.findIndex((e) => e.clubId === input.clubId && e.accountId === a.id);
  if (index >= 0 && ['pending', 'approved'].includes(all[index].status))
    throw new Error('duplicate');
  const now = new Date().toISOString();
  const item: Enrollment = {
    id: index >= 0 ? all[index].id : crypto.randomUUID(),
    accountId: a.id,
    clubId: input.clubId,
    level: input.level,
    days: [...new Set(input.days)].sort(),
    message: input.message.trim(),
    sharePhone: !!input.sharePhone,
    status: 'pending',
    createdAt: index >= 0 ? all[index].createdAt : now,
    updatedAt: now,
    reviewNote: '',
    applicant: {
      displayName: a.displayName,
      studentId: a.studentId,
      email: a.email,
      major: a.major,
      grade: a.grade,
      phone: input.sharePhone ? a.phone : '',
    },
    history: [
      ...(index >= 0 ? all[index].history : []),
      { status: 'pending', at: now, actorId: a.id },
    ],
  };
  if (index >= 0) all[index] = item;
  else all.push(item);
  write(all);
  return item;
}
export function cancelEnrollment(id: string) {
  const a = signedIn(),
    all = read(),
    e = all.find((e) => e.id === id);
  if (!e || e.accountId !== a.id) throw new Error('forbidden');
  if (!['pending', 'approved'].includes(e.status)) throw new Error('transition');
  e.status = 'cancelled';
  e.updatedAt = new Date().toISOString();
  e.history.push({ status: e.status, at: e.updatedAt, actorId: a.id });
  write(all);
  return e;
}
export function clubEnrollments(): EnrollmentView[] {
  const a = signedIn(),
    ids = managedClubIds(a);
  if (!ids.length) throw new Error('forbidden');
  const students = studentAccounts();
  return read()
    .filter((e) => ids.includes(e.clubId))
    .map((e) => {
      const s = students.find((a) => a.id === e.accountId) || e.applicant;
      return {
        ...e,
        student: {
          displayName: s?.displayName || '—',
          studentId: s?.studentId || '—',
          email: s?.email || '',
          major: s?.major || '',
          grade: s?.grade || '',
          phone: e.sharePhone ? s?.phone || '' : '',
        },
      };
    });
}
export function reviewEnrollment(id: string, status: 'approved' | 'declined', note = '') {
  const a = signedIn(),
    all = read(),
    e = all.find((e) => e.id === id);
  if (!e || !managedClubIds(a).includes(e.clubId) || e.accountId === a.id)
    throw new Error('forbidden');
  if (!['approved', 'declined'].includes(status) || e.status !== 'pending')
    throw new Error('transition');
  if (note.length > 500) throw new Error('invalid');
  e.status = status;
  e.reviewNote = note.trim();
  e.updatedAt = new Date().toISOString();
  e.history.push({ status, at: e.updatedAt, actorId: a.id });
  write(all);
  return e;
}
export function enrollmentStats(items: Enrollment[]) {
  return {
    pending: items.filter((e) => e.status === 'pending').length,
    approved: items.filter((e) => e.status === 'approved').length,
    declined: items.filter((e) => e.status === 'declined').length,
  };
}
export function enrollmentStatus(lang: string, status: EnrollmentStatus) {
  const labels: Record<EnrollmentStatus, [string, string, string]> = {
    pending: ['À examiner', 'Pending review', '待审核'],
    approved: ['Inscription acceptée', 'Registration accepted', '报名已接受'],
    declined: ['Inscription refusée', 'Registration declined', '报名未通过'],
    cancelled: ['Inscription annulée', 'Registration cancelled', '报名已取消'],
  };
  return labels[status];
}
