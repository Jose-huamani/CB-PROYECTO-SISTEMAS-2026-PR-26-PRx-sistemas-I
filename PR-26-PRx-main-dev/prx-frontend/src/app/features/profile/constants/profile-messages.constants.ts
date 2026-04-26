export const PROFILE_MESSAGES = {
  UPDATE: {
    SUCCESS: 'Tu perfil ha sido actualizado correctamente.',
    ERROR: 'No se pudo actualizar el perfil. Intenta de nuevo.',
  },
  CHANGE_PASSWORD: {
    SUCCESS: 'Contraseña actualizada correctamente.',
    ERROR: 'No se pudo cambiar la contraseña. Verifica tu contraseña actual.',
  },
  AVATAR: {
    SUCCESS: 'Foto de perfil actualizada.',
    ERROR: 'No se pudo actualizar la foto de perfil.',
  },
  LOAD: {
    ERROR: 'No se pudo cargar el perfil.',
  },
} as const;
