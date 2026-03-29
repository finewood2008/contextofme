import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { getStoredLocale, setStoredLocale, t as translate, type Locale, type TranslationKey } from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale);

  const setLocale = useCallback((l: Locale) => {
    setStoredLocale(l);
    setLocaleState(l);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "zh" : "en");
  }, [locale, setLocale]);

  const t = useMemo(() => {
    return (key: TranslationKey) => translate(key, locale);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Fallback for components outside provider
    const locale = getStoredLocale();
    return {
      locale,
      setLocale: setStoredLocale,
      toggleLocale: () => {},
      t: (key: TranslationKey) => translate(key, locale),
    };
  }
  return ctx;
}
