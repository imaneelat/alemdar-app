import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import React from 'react';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

const i18n = new I18n({ en, tr });
i18n.enableFallback = true;
i18n.locale = getLocales()[0]?.languageCode ?? 'en';

// Internal listeners — bridges imperative setLocale() into React context
let _listeners: ((code: string) => void)[] = [];

// Backward-compatible export — LanguageSheet can keep calling this
export const setLocale = (code: string) => {
  i18n.locale = code;
  _listeners.forEach(f => f(code));
};

// ── Context ────────────────────────────────────────────────────────────────────

type LanguageContextType = { locale: string; setLocale: (code: string) => void };

const LanguageContext = createContext<LanguageContextType>({
  locale: i18n.locale,
  setLocale,
});

// ── Provider ───────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState(i18n.locale);

  useEffect(() => {
    const fn = (code: string) => setLocaleState(code);
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter(l => l !== fn); };
  }, []);

  const handleSetLocale = useCallback((code: string) => setLocale(code), []);

  return React.createElement(
    LanguageContext.Provider,
    { value: { locale, setLocale: handleSetLocale } },
    children
  );
}

// ── Hooks ──────────────────────────────────────────────────────────────────────

/** Call in any screen that uses t() — re-renders it when language changes. */
export function useLocale() {
  const { locale } = useContext(LanguageContext);
  return locale;
}

/** Returns setLocale for use inside components (e.g. LanguageSheet). */
export function useSetLocale() {
  return useContext(LanguageContext).setLocale;
}

// ── Translation helper ─────────────────────────────────────────────────────────

export const t = (key: string, options?: Record<string, unknown>) =>
  i18n.t(key, options);
