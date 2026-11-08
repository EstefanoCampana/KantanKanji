"use client";

import { createContext, useCallback, useContext, useState } from "react";

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const [history, setHistory] = useState(["home"]);

  const currentRoute = history[history.length - 1];

  // Navigate to another screen
  const navigate = useCallback((route) => {
    setHistory((prev) => [...prev, route]);
  }, []);

  // Return to the previous screen
  const back = useCallback(() => {
    setHistory((prev) => {
      if (prev.length <= 1) return prev;

      return prev.slice(0, -1);
    });
  }, []);

  // Return directly to the home screen
  const goHome = useCallback(() => {
    setHistory(["home"]);
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        history,
        navigate,
        back,
        goHome,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error("useNavigation must be used inside NavigationProvider");
  }

  return context;
}
