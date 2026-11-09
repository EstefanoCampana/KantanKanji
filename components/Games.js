import { GameCard } from "./GameCard";

import { useCallback, useState, useMemo, useEffect } from "react";
import { useMediaQuery } from "./UseMediaQuery";
import { useNavigation } from "@/app/context/NavigationContext";
import { useKeyboard } from "@/app/context/KeyboardContext";
import { useMenuNavigation } from "@/app/hooks/useMenuNavigation";

const GAMES = [
  "Kana Basics",
  "Kana Drill",
  "Sentence Structure",
  "Practice Particle",
  "Practice Kanji",
  "Practice Writing",
  "Practice Reading",
];

const THUMBNAILS = [
  "/placeholder.png",
  "/kanaDrillThumb.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
];

const GAME_ROUTES = {
  "Kana Drill": "drill",
  "Sentence Structure": "sentence",
  "Practice Particle": "particle",
  "Practice Kanji": "kanji",
};

export default function Game() {
  //Used to check if it should have a mobile or computer layout.
  const smallScreen = useMediaQuery("(max-width: 768px)");

  const { navigate, currentRoute } = useNavigation();

  //Game selected from the games array.
  const { selected, setSelected, moveSelection } = useMenuNavigation(
    GAMES.length,
  );

  const cardsPerPage = smallScreen ? 9 : 3;
  // Determine which page contains the selected game
  const currentPage = Math.floor(selected / cardsPerPage);
  // Determine the first game index on that page
  const startIndex = currentPage * cardsPerPage;
  // Get only the three games for the current page
  const visibleGames = GAMES.slice(startIndex, startIndex + cardsPerPage);

  const selectGame = useCallback(
    (gameMode) => {
      console.log("Selected:", gameMode);

      const route = GAME_ROUTES[gameMode];

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
          selectGame(GAMES[selected]);
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
    [selected, selectGame, moveSelection],
  );

  useKeyboard(handleKeyboard, currentRoute === "games");
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="grid grid-cols-3 flex-1 min-h-0 gap-4">
        {visibleGames.map((game, index) => {
          const actualIndex = startIndex + index;

          return (
            <GameCard
              key={game}
              title={smallScreen ? game.split(" ").slice(1) : game}
              selected={selected === actualIndex}
              action={() => {
                setSelected(actualIndex);
                selectGame(game);
              }}
              image={THUMBNAILS[actualIndex]}
            />
          );
        })}
      </div>
    </div>
  );
}
