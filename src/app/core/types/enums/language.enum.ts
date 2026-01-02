export const LanguageEnum = {
  KM: 'km',
  EN: 'en',
  CH: 'ch',
  FR: 'fr',
  VN: 'vn',
} as const;
export type LanguageEnum = (typeof LanguageEnum)[keyof typeof LanguageEnum];
