import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';

/**
 * Unifica el valor del OTP del Formly/InputOtp: lee del formulario, solo dígitos,
 * y rellena con ceros a la izquierda si el control lo entregó como número (p. ej. pierde el 0 inicial).
 */
export function normalizeVerificationCode(
  value: string | number | null | undefined,
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
