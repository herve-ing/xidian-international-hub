import type { ApplicationRecord } from './repositories/application-repository.ts';
import { documentChecklist } from './repositories/application-repository.ts';
export function applicationSummary(record: ApplicationRecord | null) {
  const prepared = new Set(record?.documents || []);
  const missing = documentChecklist.filter((d) => !prepared.has(d.id));
  return {
    missing,
    prepared: documentChecklist.length - missing.length,
    total: documentChecklist.length,
    next: !record
      ? 'start'
      : record.stage === 'preparing' && missing.length
        ? 'documents'
        : 'official',
  };
}
