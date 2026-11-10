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
  drill: ["hiragana", "あ-row", "gojuon"],
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

          setSettings({ ...INITIAL_SETTINGS, ...parsed });
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, isHydrated]);

  const updateSettings = useCallback((category, settings) => {
    if (!Object.hasOwn(INITIAL_SETTINGS, category)) return;

    setSettings((prev) => {
      const currentSettings = prev[category];

      return {
        ...prev,
        [category]: settings,
      };
    });
  }, []);

  const getSettings = useCallback(
    (category) => settings[category] ?? null,
    [settings],
  );

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, getSettings, isHydrated }}
    >
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
