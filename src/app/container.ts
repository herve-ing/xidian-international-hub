import { clubs } from '../clubs.ts';
import { LocalAccountRepository } from '../repositories/account-repository.ts';
import type { KeyValueStore } from '../repositories/key-value-store.ts';
import { createAuthService } from '../services/auth-service.ts';
const store = (kind: 'localStorage' | 'sessionStorage'): KeyValueStore => ({
  get: (key) => globalThis[kind].getItem(key),
  set: (key, value) => globalThis[kind].setItem(key, value),
  remove: (key) => globalThis[kind].removeItem(key),
});
export const accountRepository = new LocalAccountRepository(store('localStorage'));
export const auth = createAuthService({
  accounts: accountRepository,
  session: store('sessionStorage'),
  clubIds: () => clubs.map((c) => c.id),
  professorDemoCode: 'XIDIAN-PROF-DEMO-2026',
});
