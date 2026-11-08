"use client";

import { NavigationProvider } from "@/app/context/NavigationContext";
import { KeyboardProvider } from "@/app/context/KeyboardContext";

export default function AppProviders({ children }) {
  return (
    <NavigationProvider>
      <KeyboardProvider>{children}</KeyboardProvider>
    </NavigationProvider>
  );
}
