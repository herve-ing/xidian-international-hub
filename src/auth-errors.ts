export const AuthErrorCode = {
  Required: 'required',
  Email: 'email',
  Phone: 'phone',
  Grade: 'grade',
  Password: 'password',
  Duplicate: 'duplicate',
  Credentials: 'credentials',
  Leader: 'leader',
  ProfessorCode: 'code',
  Confirmation: 'confirm',
  Session: 'session',
  Forbidden: 'forbidden',
  Club: 'club',
  Student: 'student',
  Storage: 'storage',
} as const;
export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];
export { AuthError } from './domain/errors.ts';
import { AuthError } from './domain/errors.ts';
export function authErrorCode(error: unknown): AuthErrorCode {
  return error instanceof AuthError ? error.code : AuthErrorCode.Storage;
}
