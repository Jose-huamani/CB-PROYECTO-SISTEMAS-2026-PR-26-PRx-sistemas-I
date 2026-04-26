import { parseEnvFlag, toNumberOrDefault } from '@shared/utils/env.util';

export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'PRX Backend',
    version: process.env.APP_VERSION ?? '1.0.0',
    port: toNumberOrDefault(process.env.PORT, 3000),
    apiPrefix: process.env.API_PREFIX ?? 'prx',
  },
  database: {
    url: process.env.DATABASE_URL ?? '',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? '',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  mail: {
    host: process.env.MAIL_HOST ?? '',
    port: toNumberOrDefault(process.env.MAIL_PORT, 587),
    user: process.env.MAIL_USER ?? '',
    pass: process.env.MAIL_PASS ?? '',
    from: process.env.MAIL_FROM ?? '',
    /**
     * Sin SMTP: el código se registra en consola (MailService).
     * - true si MAIL_SKIP_SEND=true
     * - o en entornos distintos de production, salvo MAIL_FORCE_SMTP=true
     */
    skipSend:
      parseEnvFlag(process.env.MAIL_SKIP_SEND) ||
      (process.env.NODE_ENV !== 'production' &&
        !parseEnvFlag(process.env.MAIL_FORCE_SMTP)),
  },
  storage: {
    accessKeyId: process.env.TIGRIS_STORAGE_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.TIGRIS_STORAGE_SECRET_ACCESS_KEY ?? '',
    endpoint: process.env.TIGRIS_STORAGE_ENDPOINT ?? '',
    publicBucket: process.env.TIGRIS_PUBLIC_BUCKET ?? '',
    privateBucket: process.env.TIGRIS_PRIVATE_BUCKET ?? '',
  },
  throttle: {
    ttl: toNumberOrDefault(process.env.THROTTLE_TTL, 60000),
    limit: toNumberOrDefault(process.env.THROTTLE_LIMIT, 20),
  },
});
