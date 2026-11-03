"use client";
import KanaDrillComp from "@/components/KanaDrill";
import { useCallback, useEffect, useState, useMemo, use } from "react";
import Image from "next/image";
export default function Game() {
  const [selected, setSelected] = useState(0);
  const [start, setStart] = useState(false);
  const [gameMode, setGameMode] = useState(null);

  const options = useMemo(() => ["Start", "Settings", "Help"], []);
  const games = useMemo(
    () => ["Kana Drill", "Particle Practice", "Kanji Practice"],
    [],
  );

  const back = useCallback(() => {
    if (gameMode != null) {
      setGameMode(null);
    }
    if (start == true && gameMode == null) {
      setStart(false);
    }
  }, [gameMode, start]);

  const selectOption = useCallback(
    (option) => {
      console.log("Selected:", option);

      switch (option) {
        case "Start":
          setStart(true);
          setSelected(0);
          break;

        case "Settings":
          // Open settings
          break;

        case "Help":
          // Open help
          break;

        default:
          break;
      }
    },
    [setStart],
  );
  const selectGameMode = useCallback(
    (gameMode) => {
      console.log("Selected:", gameMode);

      switch (gameMode) {
        case "Kana Drill":
          setGameMode("drill");
          break;

        case "Particle Practice":
          setGameMode("particle");
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
  const changeOption = useCallback(
    (direction) => {
      if (start == false) {
        if (direction === "up") {
          setSelected((prev) => (prev - 1 + options.length) % options.length);
        }

        if (direction === "down") {
          setSelected((prev) => (prev + 1) % options.length);
        }
      } else if (start == true) {
        if (direction === "left") {
          setSelected((prev) => (prev - 1 + options.length) % options.length);
        }
        if (direction === "right") {
          setSelected((prev) => (prev + 1) % options.length);
        }
      }
    },
    [options.length, start],
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
          if (start == false) {
            selectOption(options[selected]);
          } else if (start == true) {
            selectGameMode(games[selected]);
          }

          break;

        case "arrowup":
          changeOption("up");
          break;

        case "arrowdown":
          changeOption("down");
          break;

        case "arrowleft":
          changeOption("left");
          break;

        case "arrowright":
          changeOption("right");
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
  }, [
    changeOption,
    selectOption,
    options,
    selected,
    games,
    start,
    selectGameMode,
    back,
  ]);

  return (
    <main className="flex flex-col items-center min-h-screen p-2 overflow-hidden">
      <div className="flex flex-1 w-full flex-col bg-amber-50 p-4 rounded-2xl">
        {start ? (
          <div className="flex flex-col flex-1 min-h-0">
            <p
              className="self-start m-2 text-black cursor-pointer"
              onClick={back}
            >
              &#10094;- Back
            </p>
            {gameMode === null && (
              <div className="flex flex-row flex-1 py-10 min-h-0">
                {games.map((game, id) => (
                  <GameCard
                    key={id}
                    title={game}
                    selected={selected === id}
                    action={() => {
                      setSelected(id);
                      selectGameMode(game);
                    }}
                    image={"/kanaDrillThumb.png"}
                  />
                ))}
              </div>
            )}
            {gameMode === "drill" && <KanaDrillComp />}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center">
            <div className="flex flex-col md:flex-row text-center">
              <div className="flex flex-col text-center font-light">
                <p className="text-sm text-amber-50">welcome to</p>
                <p className="text-4xl text-black">Welcome to</p>
              </div>
              <div className="flex flex-col text-center">
                <p className="text-sm font-light text-black tracking-[8px]">
                  かんたんかんじ
                </p>
                <p className="text-4xl text-black font-bold ml-2">簡単漢字！</p>
              </div>
            </div>
            <div className="w-full md:w-1/2 my-auto">
              {options.map((option, id) => (
                <Option
                  key={id}
                  text={option}
                  selected={selected === id}
                  action={() => {
                    setSelected(id);
                    selectOption(option);
                  }}
                ></Option>
              ))}
            </div>
            {/* Bottom instructions */}
            <div className="flex w-full mt-auto justify-between text-amber-50 md:text-black text-lg">
              <div className="flex gap-4">
                <p>^ - Move</p>
                <p>Enter - Select</p>
              </div>

              <div>
                <p>Left Click - Select</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Option({ text, selected = false, action }) {
  return (
    <button
      className={`text-black border border-black p-4 rounded-xl my-2 w-full text-center ${selected ? `bg-green-300` : `bg-gray-300`}`}
      onClick={action}
    >
      {text}
    </button>
  );
}

function GameCard({ image, title, action, selected = false }) {
  return (
    <div
      className={`flex flex-col flex-1 min-h-0 border-2 p-4 mx-2 border-black ${selected ? `bg-green-300` : `bg-gray-500`}`}
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
      <div className="flex py-2 shrink-0">
        <p className="text-white font-bold">{title}</p>
      </div>
    </div>
  );
}
