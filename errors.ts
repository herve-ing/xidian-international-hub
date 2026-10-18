export type AuthErrorCode =
  | 'required'
  | 'email'
  | 'phone'
  | 'grade'
  | 'password'
  | 'duplicate'
  | 'credentials'
  | 'leader'
  | 'session'
  | 'forbidden'
  | 'club'
  | 'student'
  | 'code';

/** Typed error: the UI maps `code` to a translated message. */
export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.name = 'AuthError';
    this.code = code;
  }
}
