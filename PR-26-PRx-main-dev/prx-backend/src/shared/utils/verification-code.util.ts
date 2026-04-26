import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';

export function normalizeVerificationCode(
  value: string | null | undefined,
  length: number = AUTH_CONSTANTS.VERIFICATION.CODE_LENGTH,
): string {
  if (value == null) {
    return '';
  }

  let digits = String(value).trim().replace(/\D/g, '');

  if (digits.length > 0 && digits.length < length) {
    digits = digits.padStart(length, '0');
  }

  return digits;
}
