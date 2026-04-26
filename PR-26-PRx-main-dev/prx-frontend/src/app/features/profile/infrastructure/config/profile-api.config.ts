export const PROFILE_API_CONFIG = {
  base: '/profile',
  endpoints: {
    me: '/me',
    update: '',
    changePassword: '/change-password',
    uploadAvatar: '/avatar',
  },
} as const;
