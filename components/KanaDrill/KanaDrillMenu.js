"use client";

import { useCallback } from "react";
import { GameCard } from "../GameCard";
import PageLayout from "../PageLayout";
import { useKeyboard } from "@/app/context/KeyboardContext";
import { useMenuNavigation } from "@/app/hooks/useMenuNavigation";
import { useNavigation } from "@/app/context/NavigationContext";

const LEVELS = ["Hiragana", "Katakana", "Custom"];
const THUMBNAILS = [
  "/kanaDrillThumb.png",
  "/placeholder.png",
  "/placeholder.png",
];
const LEVELS_ROUTE = {
  Hiragana: "hiragana",
  Katakana: "katakana",
  Custom: "custom",
};

export default function KanaDrillMenu() {
  const { navigate, currentRoute } = useNavigation();

  const { selected, moveSelection } = useMenuNavigation(LEVELS.length);

  const selectLevel = useCallback(
    (level) => {
      const route = LEVELS_ROUTE[level];

      if (route) {
        navigate(route);
      }
    },
    [navigate],
  );

  const checkLevel = (level) => {
    if (level === "Hiragana") {
      navigate("hiragana");
    }
    if (level === "Katakana") {
      navigate("katakana");
    }
  };

  const handleKeyboard = useCallback(
    (event) => {
      switch (event.key.toLowerCase()) {
        case "enter":
          selectLevel(LEVELS[selected]);

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
      {LEVELS.map((level, id) => (
        <GameCard
          key={id}
          action={() => checkLevel(level)}
          selected={selected === id}
          image={THUMBNAILS[id]}
          title={level}
        />
      ))}
    </PageLayout>
  );
}
