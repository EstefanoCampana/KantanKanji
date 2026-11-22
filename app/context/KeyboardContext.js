"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigation } from "./NavigationContext";

const keyboardContext = createContext(null);

const SWIPE_THRESHOLD = 50;

export function KeyboardProvider({ children }) {
  const activeHandler = useRef(null);
  const activeSwipeHandler = useRef(null);
  const touchStart = useRef(null);
  const { back } = useNavigation();

  const registerHandler = useCallback((handler) => {
    activeHandler.current = handler;

    return () => {
      if (activeHandler.current === handler) {
        activeHandler.current = null;
      }
    };
  }, []);

  const registerSwipeHandler = useCallback((handler) => {
    activeSwipeHandler.current = handler;

    return () => {
      if (activeSwipeHandler.current === handler) {
        activeSwipeHandler.current = null;
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

      if (event.key === "Escape" || event.key.toLowerCase() === "b") {
        back();
        return;
      }

      activeHandler.current?.(event);
    };

    const handleTouchStart = (event) => {
      if (!event.touches?.length) return;

      const touch = event.touches[0];

      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const handleTouchEnd = (event) => {
      if (!touchStart.current || !event.changedTouched?.length) {
        touchStart.current = null;
        return;
      }

      const touch = event.changedTouches[0];

      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;

      touchStart.current = null;

      if (
        Math.abs(deltaX) < SWIPE_THRESHOLD ||
        Math.abs(deltaX) < Math.abs(deltaY)
      ) {
        return;
      }

      const direction = deltaX < 0 ? "left" : "right";

      activeSwipeHandler.current?.(direction);
    };
    const handleTouchCancel = () => {
      touchStart.current = null;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [back]);
  return (
    <keyboardContext.Provider value={{ registerHandler, registerSwipeHandler }}>
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

export function useSwipe(handler, enabled = true) {
  const context = useContext(keyboardContext);

  if (!context) {
    throw new Error("useSwipe must be used inside KeyboardProvider");
  }

  const { registerSwipeHandler } = context;
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const registeredHandler = (direction) => {
      handlerRef.current?.(direction);
    };

    return registerSwipeHandler(registeredHandler);
  }, [enabled, registerSwipeHandler]);
}
