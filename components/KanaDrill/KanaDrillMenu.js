"use client";

import { useCallback } from "react";
import { GameCard } from "../GameCard";
import PageLayout from "../PageLayout";
import { useKeyboard } from "@/app/context/KeyboardContext";
import { useMenuNavigation } from "@/app/hooks/useMenuNavigation";
import { useNavigation } from "@/app/context/NavigationContext";
import { useBestTimes } from "@/app/context/BestTimeContext";

const LEVELS = ["Hiragana", "Katakana", "Custom"];
const THUMBNAILS = [
  "/kanaDrillThumb.png",
  "/placeholder.png",
  "/placeholder.png",
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

  const selectLevel = useCallback(
    (level) => {
      const route = LEVELS_ROUTE[level];

      if (route) {
        navigate(route);
      }
    },
    [navigate],
  );

  const handleKeyboard = useCallback(
    (event) => {
      switch (event.key.toLowerCase()) {
        case "enter":
          selectLevel(LEVELS[selected]);
          break;

        case "arrowleft":
          moveSelection("left");
          break;

        case "arrowright":
          moveSelection("right");
          break;

        default:
          break;
      }
    },
    [selected, selectLevel, moveSelection],
  );

  useKeyboard(handleKeyboard, currentRoute === "drill");

  return (
    <PageLayout title={"Kana Selection"}>
      {LEVELS.map((level, id) => {
        const category = level.toLowerCase();

        return (
          <GameCard
            key={id}
            action={() => selectLevel(level)}
            selected={selected === id}
            image={THUMBNAILS[id]}
            title={level}
            bestTime={bestTimes[category]}
          />
        );
      })}
    </PageLayout>
  );
}
