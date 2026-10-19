import { currentAccount } from '../accounts.ts';
import { accountRepository } from '../app/container.ts';
import { supervisors } from '../supervisors.ts';
export type ApplicationStage = 'preparing' | 'submitted' | 'interview' | 'supplementary' | 'offer';
export const stages: ApplicationStage[] = [
  'preparing',
  'submitted',
  'interview',
  'supplementary',
  'offer',
];
export type ApplicationRecord = {
  id: string;
  accountId: string;
  level: 'Master' | 'PhD';
  major: string;
  language: string;
  topic: string;
  reference: string;
  stage: ApplicationStage;
  documents: string[];
  updatedAt: string;
  history: { stage: ApplicationStage; at: string; note: string }[];
};
export type ThreadMessage = {
  id: string;
  senderId: string;
  name: string;
  body: string;
  at: string;
};
export type SupervisorThread = {
  id: string;
  accountId: string;
  supervisorId: string;
  subject: string;
  messages: ThreadMessage[];
  updatedAt: string;
};
const applicationKey = 'xidian-applications-v1',
  threadKey = 'xidian-supervisor-threads-v1',
  facultyKey = 'xidian-faculty-links-v1';
function read<T>(key: string): T[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}
function signedIn() {
  const a = currentAccount();
  if (!a) throw new Error('session');
  return a;
}
export function myApplication() {
  const a = signedIn();
  return read<ApplicationRecord>(applicationKey).find((x) => x.accountId === a.id) || null;
}
export function saveApplication(
  input: Pick<
    ApplicationRecord,
    'level' | 'major' | 'language' | 'topic' | 'reference' | 'stage' | 'documents'
  >,
  note = '',
) {
  const actor = signedIn();
  if (
    !['Master', 'PhD'].includes(input.level) ||
    !input.major.trim() ||
    input.major.length > 150 ||
    input.topic.length > 2000 ||
    input.reference.length > 100 ||
    !stages.includes(input.stage) ||
    !['English', 'Chinese'].includes(input.language) ||
    input.documents.some((x) => !documentChecklist.some((d) => d.id === x))
  )
    throw new Error('invalid');
  const all = read<ApplicationRecord>(applicationKey),
    old = all.find((x) => x.accountId === actor.id),
    now = new Date().toISOString();
  const record: ApplicationRecord = {
    ...input,
    documents: [...new Set(input.documents)],
    id: old?.id || crypto.randomUUID(),
    accountId: actor.id,
    updatedAt: now,
    history: old?.history || [],
  };
  if (!old || old.stage !== input.stage)
    record.history = [
      ...record.history,
      { stage: input.stage, at: now, note: note.trim().slice(0, 500) },
    ];
  write(applicationKey, [...all.filter((x) => x.accountId !== actor.id), record]);
  return record;
}
export function facultyLink() {
  const actor = signedIn();
  if (actor.role !== 'professor') throw new Error('forbidden');
  return (
    read<{ accountId: string; supervisorId: string }>(facultyKey).find(
      (x) => x.accountId === actor.id,
    )?.supervisorId || ''
  );
}
export function linkFacultyProfile(supervisorId: string) {
  const actor = signedIn();
  if (actor.role !== 'professor') throw new Error('forbidden');
  if (!supervisors.some((s) => s.id === supervisorId)) throw new Error('supervisor');
  const all = read<{ accountId: string; supervisorId: string }>(facultyKey);
  if (all.some((x) => x.supervisorId === supervisorId && x.accountId !== actor.id))
    throw new Error('claimed');
  write(facultyKey, [
    ...all.filter((x) => x.accountId !== actor.id),
    { accountId: actor.id, supervisorId },
  ]);
}
export function ownThreads() {
  const actor = signedIn();
  return read<SupervisorThread>(threadKey)
    .filter((t) =>
      actor.role === 'professor' ? t.supervisorId === facultyLink() : t.accountId === actor.id,
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
export function startThread(supervisorId: string, subject: string, body: string) {
  const actor = signedIn();
  if (actor.role === 'professor') throw new Error('applicant');
  if (!supervisors.some((s) => s.id === supervisorId)) throw new Error('supervisor');
  if (!subject.trim() || subject.length > 150 || !body.trim() || body.length > 4000)
    throw new Error('invalid');
  const all = read<SupervisorThread>(threadKey),
    old = all.find((t) => t.accountId === actor.id && t.supervisorId === supervisorId);
  if (old) return replyToThread(old.id, body);
  const now = new Date().toISOString();
  const thread: SupervisorThread = {
    id: crypto.randomUUID(),
    accountId: actor.id,
    supervisorId,
    subject: subject.trim(),
    updatedAt: now,
    messages: [
      {
        id: crypto.randomUUID(),
        senderId: actor.id,
        name: actor.displayName,
        body: body.trim(),
        at: now,
      },
    ],
  };
  write(threadKey, [...all, thread]);
  return thread;
}
export function replyToThread(threadId: string, body: string) {
  const actor = signedIn(),
    all = read<SupervisorThread>(threadKey),
    thread = all.find((t) => t.id === threadId);
  if (
    !thread ||
    !(actor.role === 'professor'
      ? thread.supervisorId === facultyLink()
      : thread.accountId === actor.id)
  )
    throw new Error('forbidden');
  if (!body.trim() || body.length > 4000) throw new Error('invalid');
  const now = new Date().toISOString();
  const next = {
    ...thread,
    updatedAt: now,
    messages: [
      ...thread.messages,
      {
        id: crypto.randomUUID(),
        senderId: actor.id,
        name: actor.displayName,
        body: body.trim(),
        at: now,
      },
    ],
  };
  write(
    threadKey,
    all.map((t) => (t.id === thread.id ? next : t)),
  );
  return next;
}
export function applicantOverview() {
  if (signedIn().role !== 'professor') throw new Error('forbidden');
  return read<ApplicationRecord>(applicationKey).map((app) => {
    const person = accountRepository.findById(app.accountId);
    return { ...app, displayName: person?.displayName || '—', email: person?.email || '' };
  });
}
export const documentChecklist = [
  {
    id: 'diploma',
    fr: 'Diplôme ou attestation de fin d’études',
    en: 'Diploma or pre-graduation certificate',
  },
  {
    id: 'passport',
    fr: 'Passeport valide · vérifier les exigences',
    en: 'Valid passport · check requirements',
  },
  { id: 'language', fr: 'Justificatif de langue', en: 'Language proficiency certificate' },
  { id: 'medical', fr: 'Examen médical', en: 'Physical examination form' },
  { id: 'record', fr: 'Extrait de casier judiciaire', en: 'Non-criminal record certificate' },
  {
    id: 'plan',
    fr: 'Projet d’études · au moins 800 mots (guide 2026)',
    en: 'Study plan · at least 800 words (2026 guide)',
  },
  { id: 'finance', fr: 'Justificatif de financement', en: 'Financial guarantee' },
  {
    id: 'video',
    fr: 'Vidéo de présentation · 3 à 5 minutes (guide 2026)',
    en: 'Introduction video · 3–5 minutes (2026 guide)',
  },
  {
    id: 'acceptance',
    fr: 'Lettre de préacceptation du superviseur',
    en: 'Supervisor pre-acceptance letter',
  },
  {
    id: 'support',
    fr: 'Pièces complémentaires selon votre situation',
    en: 'Supporting documents for your circumstances',
  },
];
