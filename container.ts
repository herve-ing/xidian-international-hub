// Composition root: the only place that knows which implementations are used.
// TODO: import your real list, e.g. `import { clubs } from '../clubs/clubs.ts'`.
import { LocalAccountRepository } from '../repositories/account-repository.ts';
import { fromWebStorage } from '../repositories/key-value-store.ts';
import { createAuthService } from '../services/auth-service.ts';

const clubs: { id: string }[] = [];

export const auth = createAuthService({
  accounts: new LocalAccountRepository(fromWebStorage(localStorage)),
  session: fromWebStorage(sessionStorage),
  clubIds: () => clubs.map((c) => c.id),
  professorDemoCode: 'XIDIAN-PROF-DEMO-2026',
});
