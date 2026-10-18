import type { StoredAccount } from '../domain/account.ts';
import type { KeyValueStore } from './key-value-store.ts';

/**
 * Port used by the services. Today: localStorage.
 * Tomorrow: an HTTP implementation calling the backend (see openapi.json).
 */
export interface AccountRepository {
  list(): StoredAccount[];
  findByIdentifier(identifier: string): StoredAccount | undefined;
  findById(id: string): StoredAccount | undefined;
  add(account: StoredAccount): void;
  replace(account: StoredAccount): void;
}

export const ACCOUNTS_KEY = 'xidian-accounts-v1';

export class LocalAccountRepository implements AccountRepository {
  private readonly store: KeyValueStore;

  constructor(store: KeyValueStore) {
    this.store = store;
  }

  list(): StoredAccount[] {
    try {
      const parsed: unknown = JSON.parse(this.store.get(ACCOUNTS_KEY) ?? '[]');
      return Array.isArray(parsed) ? (parsed as StoredAccount[]) : [];
    } catch {
      return [];
    }
  }

  findByIdentifier(identifier: string): StoredAccount | undefined {
    const value = identifier.trim().toLowerCase();
    return this.list().find((a) => a.email === value || a.studentId.toLowerCase() === value);
  }

  findById(id: string): StoredAccount | undefined {
    return this.list().find((a) => a.id === id);
  }

  add(account: StoredAccount): void {
    this.save([...this.list(), account]);
  }

  replace(account: StoredAccount): void {
    this.save(this.list().map((a) => (a.id === account.id ? account : a)));
  }

  private save(accounts: StoredAccount[]): void {
    this.store.set(ACCOUNTS_KEY, JSON.stringify(accounts));
  }
}
