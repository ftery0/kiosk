"use server";

import { cookies } from "next/headers";
import { type Locale, defaultLocale } from "@/i18n/config";

const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale() {
  const cks = await cookies();
  return cks.get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  const cks = await cookies();
  cks.set(COOKIE_NAME, locale);
}
