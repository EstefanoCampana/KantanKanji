"use client";

import { NavigationProvider } from "@/app/context/NavigationContext";
import { KeyboardProvider } from "@/app/context/KeyboardContext";
import { BestTimeProvider } from "@/app/context/BestTimeContext";
import { SettingsProvider } from "@/app/context/SettingsContext";

export default function AppProviders({ children }) {
  return (
    <NavigationProvider>
      <SettingsProvider>
        <BestTimeProvider>
          <KeyboardProvider>{children}</KeyboardProvider>
        </BestTimeProvider>
      </SettingsProvider>
    </NavigationProvider>
  );
}
