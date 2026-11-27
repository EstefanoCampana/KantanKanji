"use client";

import { NavigationProvider } from "@/app/context/NavigationContext";
import { KeyboardProvider } from "@/app/context/KeyboardContext";
import { BestTimeProvider } from "@/app/context/BestTimeContext";
import { SettingsProvider } from "@/app/context/SettingsContext";
import { LanguageProvider } from "@/app/context/LanguageContext";

export default function AppProviders({ children }) {
  return (
    <NavigationProvider>
      <SettingsProvider>
        <LanguageProvider>
          <BestTimeProvider>
            <KeyboardProvider>{children}</KeyboardProvider>
          </BestTimeProvider>
        </LanguageProvider>
      </SettingsProvider>
    </NavigationProvider>
  );
}
