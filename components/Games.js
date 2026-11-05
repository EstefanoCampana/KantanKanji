import Image from "next/image";
import KanaDrill from "./KanaDrill";
import { useCallback, useState, useMemo, useEffect } from "react";
import SentenceStructure from "./SentenceStructure";
import { useMediaQuery } from "./UseMediaQuery";

export default function Game({ gameMode, setGameMode }) {
  //Used to check if it should have a mobile or computer layout.
  const smallScreen = useMediaQuery("(max-width: 768px)");
  //Array of all the mini-games for the application.
  const games = useMemo(
    () => [
      "Kana Basics",
      "Kana Drill",
      "Sentence Structure",
      "Practice Particle ",
      "Practice Kanji",
      "Practice Writing",
      "Practice Reading",
    ],
    [],
  );

  const thumbnails = useMemo(
    () => [
      "/placeholder.png",
      "/kanaDrillThumb.png",
      "/placeholder.png",
      "/placeholder.png",
      "/placeholder.png",
      "/placeholder.png",
      "/placeholder.png",
    ],
    [],
  );
  //Game selected from the games array.
  const [selected, setSelected] = useState(0);

  const cardsPerPage = smallScreen ? 9 : 3;
  // Determine which page contains the selected game
  const currentPage = Math.floor(selected / cardsPerPage);
  // Determine the first game index on that page
  const startIndex = currentPage * cardsPerPage;
  // Get only the three games for the current page
  const visibleGames = games.slice(startIndex, startIndex + cardsPerPage);

  const back = useCallback(() => {
    if (gameMode != null) {
      setGameMode(null);
    }
  }, [gameMode, setGameMode]);
  const selectGameMode = useCallback(
    (gameMode) => {
      console.log("Selected:", gameMode);

      switch (gameMode) {
        case "Kana Drill":
          setGameMode("drill");
          break;

        case "Sentence Structure":
          setGameMode("sentence");
          break;

        case "Kanji Practice":
          setGameMode("kanji");
          break;

        default:
          break;
      }
    },
    [setGameMode],
  );

  const changeGame = useCallback(
    (direction) => {
      if (direction === "left") {
        setSelected((prev) => (prev - 1 + games.length) % games.length);
      }
      if (direction === "right") {
        setSelected((prev) => (prev + 1) % games.length);
      }
    },
    [games.length],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore shortcuts when typing inside an input or textarea
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "enter":
          selectGameMode(games[selected]);
          break;

        case "arrowleft":
          changeGame("left");
          break;

        case "arrowright":
          changeGame("right");
          break;

        case "b":
          back();

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected, games, selectGameMode, back, changeGame]);
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <p
        className="self-start mb-2 mx-2 text-black cursor-pointer"
        onClick={back}
      >
        &#10094;- Back
      </p>
      {gameMode === null && (
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
                  selectGameMode(game);
                }}
                image={thumbnails[actualIndex]}
              />
            );
          })}
        </div>
      )}
      {gameMode === "drill" && <KanaDrill />}
      {gameMode === "sentence" && <SentenceStructure />}
    </div>
  );
}
function GameCard({ image, title, action, selected = false }) {
  return (
    <div
      className={`flex flex-col w-full min-h-0 border-2 mx-2 border-black hover:cursor-pointer ${selected ? `bg-green-300 text-black` : `bg-gray-500 text-white`}`}
      onClick={action}
    >
      <div></div>
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <Image
          className="object-cover"
          src={image}
          alt="thumbnail"
          fill
          sizes="(max-width:768px) 100vw, 250px"
        ></Image>
      </div>
      <div className="flex mt-2 shrink-0 text-center justify-center">
        <p className="font-bold">{title}</p>
      </div>
    </div>
  );
}
