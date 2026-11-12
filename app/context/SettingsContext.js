"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const SettingsContext = createContext(null);

const STORAGE_KEY = "kantankanji-settings";

const INITIAL_SETTINGS = {
  customDrill: {
    kanaType: "hiragana",
    kanaRow: "あ-row",
    kanaCategory: "gojuon",
  },
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed = JSON.parse(saved);

          setSettings({
            ...INITIAL_SETTINGS,
            ...parsed,
            customDrill: {
              ...INITIAL_SETTINGS.customDrill,
              ...parsed.customDrill,
            },
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsHydrated(true);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, [settings, isHydrated]);

  const updateSettings = useCallback((setting, value) => {
    setSettings((prev) => ({
      ...prev,
      customDrill: {
        ...prev.customDrill,
        [setting]: value,
      },
    }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isHydrated }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used in SettingsProvider");
  }

  return context;
}
