export type Locale = (typeof locales)[number];

export const locales = ["ko", "en"] as const;
export const defaultLocale: Locale = "ko";
