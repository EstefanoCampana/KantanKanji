"use client";

import Text from "@/utils/languages.json";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSettings } from "./SettingsContext";
import { getKanji } from "../services/kantankanji-services";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { settings } = useSettings();
  const [textArray, setTextArray] = useState([]);
  const [kanji, setKanji] = useState([]);
  const [isJp, setIsJp] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadKanji = async () => {
      try {
        setKanji(await getKanji());
      } catch (error) {
        console.error(error);
      } finally {
        setIsHydrated(true);
      }
    };
    loadKanji();
  }, []);

  useEffect(() => {
    const checkLanguage = () => {
      if (settings.general["language"] === "english") {
        setTextArray(Text.english);
        setIsJp(false);
      } else if (settings.general["language"] === "japanese") {
        setTextArray(Text.japanese);
        setIsJp(true);
      }
    };
    checkLanguage();
  }, [settings]);

  return (
    <LanguageContext.Provider
      value={{ textArray, setTextArray, kanji, isJp, isHydrated }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used in LanguageContext");
  }

  return context;
}
