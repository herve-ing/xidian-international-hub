const ITERATIONS = 210_000;
const encoder = new TextEncoder();

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

export const randomSalt = (): string => toHex(crypto.getRandomValues(new Uint8Array(16)));

export async function hashPassword(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  );
  return toHex(new Uint8Array(bits));
}
