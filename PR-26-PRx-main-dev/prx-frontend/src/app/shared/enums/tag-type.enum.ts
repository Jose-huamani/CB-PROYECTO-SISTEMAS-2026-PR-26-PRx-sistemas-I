export const TagType = {
  file: 'file',
  repository: 'repository',
  profile: 'profile',
} as const;

export type TagType = (typeof TagType)[keyof typeof TagType];
