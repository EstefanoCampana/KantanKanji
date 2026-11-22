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
  general: {
    furigana: true,
  },
  customDrill: {
    kanaTypes: ["hiragana"],
    kanaRows: ["arow"],
    kanaCategories: ["gojuon"],
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

  const updateDrillSetting = useCallback((setting, value) => {
    setSettings((prev) => ({
      ...prev,
      customDrill: {
        ...prev.customDrill,
        [setting]: value,
      },
    }));
  }, []);

  const updateDrillSettings = useCallback((newSettings) => {
    setSettings((prev) => ({
      ...prev,
      customDrill: {
        ...prev.customDrill,
        ...newSettings,
      },
    }));
  }, []);

  const toggleDrillSetting = useCallback((setting, value) => {
    const allowedSettings = ["kanaTypes", "kanaRows", "kanaCategories"];

    if (!allowedSettings.includes(setting)) return;

    setSettings((prev) => {
      const currentValues = prev.customDrill[setting];

      if (currentValues.includes(value) && currentValues.length === 1)
        return prev;

      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...prev,
        customDrill: {
          ...prev.customDrill,
          [setting]: updatedValues,
        },
      };
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateDrillSetting,
        updateDrillSettings,
        toggleDrillSetting,
        isHydrated,
      }}
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
