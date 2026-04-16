import { createContext, useContext, useState } from 'react';
import { translations } from '../translations/index';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(localStorage.getItem('language') || 'en');

    function setLanguage(newLang) {
        setLang(newLang);
        localStorage.setItem('language', newLang);
    }

    // looks up a dot-separated key in the current language, falls back to English
    function t(key) {
        const parts = key.split('.');

        function lookup(obj) {
            let result = obj;
            let i = 0;
            while (i < parts.length) {
                result = result?.[parts[i]];
                i = i + 1;
            }
            return result;
        }

        const localized = lookup(translations[lang]);
        if (localized !== undefined) return localized;

        const fallback = lookup(translations['en']);
        return fallback !== undefined ? fallback : key;
    }

    return (
        <LanguageContext.Provider value={{ lang, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
