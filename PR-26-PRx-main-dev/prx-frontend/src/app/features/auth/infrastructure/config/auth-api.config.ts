export const AUTH_API_CONFIG = {
  base: '/auth',

  endpoints: {
    login: '/login',
    verifyLoginTwoFactor: '/verify-login-two-factor',
    logout: '/logout',
    refresh: '/refresh',
    me: '/me',

    registerRequest: '/register-request',
    confirmRegister: '/confirm-register',
    resendVerificationCode: '/resend-verification-code',

    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
} as const;
