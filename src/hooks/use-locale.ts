import { useMemo } from "react";
import { detectLocale, t as translate, type Locale, type TranslationKey } from "@/lib/i18n";

export function useLocale() {
  const locale = useMemo<Locale>(() => detectLocale(), []);

  const t = useMemo(() => {
    return (key: TranslationKey) => translate(key, locale);
  }, [locale]);

  return { locale, t };
}
