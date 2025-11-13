export const LanguageEnum = {
  KM: 'km',
  EN: 'en',
  CH: 'ch',
  FR: 'fr',
} as const;
export type LanguageEnum = (typeof LanguageEnum)[keyof typeof LanguageEnum];
