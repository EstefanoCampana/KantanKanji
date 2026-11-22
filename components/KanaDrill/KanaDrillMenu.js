"use client";

import { useCallback } from "react";
import { GameCard } from "../GameCard";
import PageLayout from "../PageLayout";
import { useKeyboard, useSwipe } from "@/app/context/KeyboardContext";
import { useMenuNavigation } from "@/app/hooks/useMenuNavigation";
import { useNavigation } from "@/app/context/NavigationContext";
import { useBestTimes } from "@/app/context/BestTimeContext";
import { useMediaQuery } from "../UseMediaQuery";

const LEVELS = ["Hiragana", "Katakana", "Custom"];
const THUMBNAILS = [
  "/kanaDrillThumb.png",
  "/katakanaDrill.png",
  "/customDrill.png",
];
const LEVELS_ROUTE = {
  Hiragana: "hiragana",
  Katakana: "katakana",
  Custom: "customDrill",
};

export default function KanaDrillMenu() {
  const { navigate, currentRoute } = useNavigation();

  const { selected, moveSelection } = useMenuNavigation(LEVELS.length);

  const { bestTimes } = useBestTimes();

  const small = useMediaQuery("(max-width: 768px)");

  const cardsPerPage = small ? 1 : 3;
  // Determine which page contains the selected game
  const currentPage = Math.floor(selected / cardsPerPage);
  // Determine the first game index on that page
  const startIndex = currentPage * cardsPerPage;
  // Get only the three games for the current page
  const visibleLevels = LEVELS.slice(startIndex, startIndex + cardsPerPage);

  const selectLevel = useCallback(
    (level) => {
      const route = LEVELS_ROUTE[level];

      if (route) {
        navigate(route);
      }
    },
    [navigate],
  );

  const handleNavigation = useCallback(
    (direction) => {
      moveSelection(direction);
    },
    [moveSelection],
  );

  const handleKeyboard = useCallback(
    (event) => {
      switch (event.key.toLowerCase()) {
        case "enter":
          selectLevel(LEVELS[selected]);
          break;

        case "arrowleft":
          handleNavigation("left");
          break;

        case "arrowright":
          handleNavigation("right");
          break;

        default:
          break;
      }
    },
    [selected, selectLevel, handleNavigation],
  );

  const handleSwipe = useCallback(
    (direction) => {
      handleNavigation(direction);
    },
    [handleNavigation],
  );

  useKeyboard(handleKeyboard, currentRoute === "drill");
  useSwipe(handleSwipe, currentRoute === "drill");

  return (
    <PageLayout title={"Kana Selection"} small={small}>
      {visibleLevels.map((level, id) => {
        const category = level.toLowerCase();
        const actualIndex = startIndex + id;

        return (
          <GameCard
            key={id}
            action={() => selectLevel(level)}
            selected={selected === actualIndex}
            image={THUMBNAILS[actualIndex]}
            title={level}
            bestTime={bestTimes[category]}
          />
        );
      })}
    </PageLayout>
  );
}
