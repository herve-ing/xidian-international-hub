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
export class AuthError extends Error {
  readonly code: AuthErrorCode;
  constructor(code: AuthErrorCode, options?: ErrorOptions) {
    super(code, options);
    this.name = 'AuthError';
    this.code = code;
  }
}
export function authErrorCode(error: unknown): AuthErrorCode {
  return error instanceof AuthError ? error.code : AuthErrorCode.Storage;
}
