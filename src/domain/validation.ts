import { GRADES, type Account } from './account.ts';
import { AuthError } from './errors.ts';

export const MIN_PASSWORD_LENGTH = 8;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s().-]{5,24}$/;

export const isEmail = (value: string): boolean => EMAIL.test(value.trim());

export function validateStudent(a: Account): void {
  const fields = [a.displayName, a.studentId, a.nationality, a.major, a.grade, a.phone, a.email];
  if (fields.some((v) => !v?.trim())) throw new AuthError('required');
  if (!isEmail(a.email)) throw new AuthError('email');
  if (!PHONE.test(a.phone)) throw new AuthError('phone');
  if (!(GRADES as readonly string[]).includes(a.grade)) throw new AuthError('grade');
}
