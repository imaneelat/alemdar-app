import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { useEffect, useState } from 'react';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

const i18n = new I18n({ en, tr });
i18n.enableFallback = true;
i18n.locale = getLocales()[0]?.languageCode ?? 'en';

let _listeners: (() => void)[] = [];
export const setLocale = (code: string) => { i18n.locale = code; _listeners.forEach(f => f()); };
export const t = (key: string) => i18n.t(key);
export function useLocale() { const [,s] = useState(0); useEffect(() => { const fn = () => s(n=>n+1); _listeners.push(fn); return () => { _listeners = _listeners.filter(l=>l!==fn); }; }, []); }
