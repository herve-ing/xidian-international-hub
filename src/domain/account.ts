export type AccountRole = 'applicant' | 'student' | 'club_leader' | 'professor';

export const GRADES = ['Bachelor', 'Master', 'PhD', 'Language program'] as const;

export interface Account {
  id: string;
  role: AccountRole;
  displayName: string;
  email: string;
  studentId: string;
  nationality: string;
  major: string;
  grade: string;
  phone: string;
  clubIds?: string[];
}

/** What is persisted: the public account plus the password material. */
export interface StoredAccount extends Account {
  salt: string;
  passwordHash: string;
}

export type NewStudent = Omit<Account, 'id' | 'role'>;
