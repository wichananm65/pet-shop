export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN_LENGTH = 6;

export function validateEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

export function validatePassword(value: string): boolean {
  return value.length >= PASSWORD_MIN_LENGTH;
}
