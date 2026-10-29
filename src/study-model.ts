export const roadmapIds = ['language', 'debug', 'git', 'project'] as const;
export type StudyPlan = {
  field: 'cs' | 'ics';
  completed: string[];
  notes: string;
  question: string;
};
export const emptyStudyPlan = (): StudyPlan => ({
  field: 'cs',
  completed: [],
  notes: '',
  question: '',
});
export function normalizeStudyPlan(value: unknown): StudyPlan {
  if (!value || typeof value !== 'object') return emptyStudyPlan();
  const v = value as Partial<StudyPlan>;
  return {
    field: v.field === 'ics' ? 'ics' : 'cs',
    completed: Array.isArray(v.completed)
      ? [
          ...new Set(
            v.completed.filter(
              (id) =>
                typeof id === 'string' && roadmapIds.includes(id as (typeof roadmapIds)[number]),
            ),
          ),
        ]
      : [],
    notes: typeof v.notes === 'string' ? v.notes.slice(0, 4000) : '',
    question: typeof v.question === 'string' ? v.question.slice(0, 1200) : '',
  };
}
export function studyStorageKey(accountId: string) {
  if (!accountId || accountId.length > 200) throw new Error('account');
  return 'xidian-study-plan-v1:' + accountId;
}
export const resources = [
  { name: 'Python', href: 'https://docs.python.org/3/tutorial/', key: 'python' },
  {
    name: 'MDN',
    href: 'https://developer.mozilla.org/en-US/docs/Learn_web_development',
    key: 'mdn',
  },
  { name: 'GitHub Learn', href: 'https://learn.github.com/', key: 'git' },
  {
    name: 'MIT OpenCourseWare',
    href: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/',
    key: 'mit',
  },
] as const;
