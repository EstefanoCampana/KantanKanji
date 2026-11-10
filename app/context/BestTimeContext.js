"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

const BestTimeContext = createContext(null);

const STORAGE_KEY = "kantankanji-best-times";

const INITIAL_BEST_TIMES = {
  hiragana: 0,
  katakana: 0,
  custom: 0,
};

export function BestTimeProvider({ children }) {
  const [bestTimes, setBestTimes] = useState(INITIAL_BEST_TIMES);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadBestTimes = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed = JSON.parse(saved);

          setBestTimes({ ...INITIAL_BEST_TIMES, ...parsed });
        }
      } catch (error) {
        console.error("Failed to load best times:", error);
      } finally {
        setIsHydrated(true);
      }
    };
    loadBestTimes();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(bestTimes));
  }, [bestTimes, isHydrated]);

  const updateBestTime = useCallback((category, elapsed) => {
    if (
      !Object.hasOwn(INITIAL_BEST_TIMES, category) ||
      elapsed == null ||
      elapsed <= 0
    )
      return;

    setBestTimes((prev) => {
      const currentBest = prev[category];

      if (currentBest !== 0 && elapsed >= currentBest) {
        return prev;
      }

      return {
        ...prev,
        [category]: elapsed,
      };
    });
  }, []);

  const getBestTime = useCallback(
    (category) => bestTimes[category] ?? 0,
    [bestTimes],
  );

  return (
    <BestTimeContext.Provider
      value={{ bestTimes, updateBestTime, getBestTime, isHydrated }}
    >
      {children}
    </BestTimeContext.Provider>
  );
}

export function useBestTimes() {
  const context = useContext(BestTimeContext);

  if (!context) {
    throw new Error("useBestTimes must be used in BestTimeProvider");
  }

  return context;
}
