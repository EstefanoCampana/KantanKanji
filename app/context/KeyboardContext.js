"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

const keyboardContext = createContext(null);

export function KeyboardProvider({ children }) {
  const activeHandler = useRef(null);

  const registerHandler = useCallback((handler) => {
    activeHandler.current = handler;

    return () => {
      if (activeHandler.current === handler) {
        activeHandler.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable
      ) {
        return;
      }
      activeHandler.current?.(event);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <keyboardContext.Provider value={{ registerHandler }}>
      {children}
    </keyboardContext.Provider>
  );
}

export function useKeyboard(handler, enabled = true) {
  const context = useContext(keyboardContext);

  if (!context) {
    throw new Error("useKeyboard must be used inside KeyboardProvider");
  }

  const { registerHandler } = context;
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const registeredHandler = (event) => {
      handlerRef.current?.(event);
    };
    return registerHandler(registeredHandler);
  }, [enabled, registerHandler]);
}
