import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';
import { codeEmailTemplate } from '@shared/infrastructure/mail/templates/partials/code-email.template';

export function loginTwoFactorTemplate(code: string): string {
  return codeEmailTemplate({
    badge: 'Verificación en dos pasos',
    title: 'Código para iniciar sesión',
    description:
      'Estás iniciando sesión en PRX. Ingresa el siguiente código para completar el acceso.',
    code,
    expirationText: `Este código expira en <strong style="color:#2D736C;">${AUTH_CONSTANTS.LOGIN_TWO_FACTOR.EXPIRES_MINUTES} minutos</strong>.`,
    helperText:
      'Si no fuiste tú, cambia tu contraseña y revisa la seguridad de tu cuenta.',
  });
}
