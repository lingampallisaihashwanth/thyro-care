import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import type { LanguagePreference } from "./types";

export const defaultLanguage: LanguagePreference = "en";

export const supportedLanguages: Array<{
  code: LanguagePreference;
  label: string;
  isSelectable: boolean;
}> = [
  { code: "en", label: "English", isSelectable: true },
  { code: "te", label: "Telugu (తెలుగు)", isSelectable: true },
  { code: "hi", label: "Hindi (हिन्दी)", isSelectable: true },
  { code: "ta", label: "Tamil", isSelectable: false },
  { code: "kn", label: "Kannada", isSelectable: false },
  { code: "ml", label: "Malayalam", isSelectable: false },
];

const supportedLanguageCodes = new Set(
  supportedLanguages.map((language) => language.code),
);

export const normalizeLanguage = (
  language?: string | null,
): LanguagePreference => {
  return supportedLanguageCodes.has(language as LanguagePreference)
    ? (language as LanguagePreference)
    : defaultLanguage;
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: {} },
    te: { translation: {} },
    hi: { translation: {} },
    ta: { translation: {} },
    kn: { translation: {} },
    ml: { translation: {} },
  },
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
  returnEmptyString: false,
});

export default i18n;
