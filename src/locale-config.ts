export const languages = [
  ['en', 'English'],
  ['fr', 'Français'],
  ['zh', '中文'],
  ['ar', 'العربية'],
  ['ru', 'Русский'],
  ['es', 'Español'],
  ['pt', 'Português'],
  ['tr', 'Türkçe'],
  ['id', 'Bahasa Indonesia'],
  ['ms', 'Bahasa Melayu'],
  ['ur', 'اردو'],
  ['hi', 'हिन्दी'],
  ['ary', 'الدارجة المغربية'],
  ['tk', 'Türkmençe'],
  ['ln', 'Lingála'],
] as const;
export type Locale = (typeof languages)[number][0];
export const defaultLocale: Locale = 'en';
export const localeKey = 'xidian-locale';
export function normalizeLocale(value: unknown): Locale {
  if (typeof value !== 'string') return defaultLocale;
  const normalized = value.toLowerCase().replace('_', '-');
  if (normalized === 'ar-ma') return 'ary';
  const code = normalized.split('-')[0];
  return languages.some(([id]) => id === code) ? (code as Locale) : defaultLocale;
}
export function localeDirection(value: string) {
  return ['ar', 'ary', 'ur'].includes(normalizeLocale(value)) ? 'rtl' : 'ltr';
}
export function intlLocale(value: string) {
  const lang = normalizeLocale(value);
  return lang === 'ary' ? 'ar-MA' : lang === 'zh' ? 'zh-CN' : lang;
}
