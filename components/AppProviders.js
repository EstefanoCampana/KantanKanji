"use client";

import { NavigationProvider } from "@/app/context/NavigationContext";
import { KeyboardProvider } from "@/app/context/KeyboardContext";
import { BestTimeProvider } from "@/app/context/BestTimeContext";

export default function AppProviders({ children }) {
  return (
    <NavigationProvider>
      <BestTimeProvider>
        <KeyboardProvider>{children}</KeyboardProvider>
      </BestTimeProvider>
    </NavigationProvider>
  );
}
