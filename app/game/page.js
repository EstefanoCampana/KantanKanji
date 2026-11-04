"use client";
import { useCallback, useEffect, useState, useMemo, use } from "react";
import Image from "next/image";
import Help from "@/components/Help";
import KanaDrill from "@/components/KanaDrill";
export default function Game() {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const games = useMemo(
    () => ["Kana Drill", "Particle Practice", "Kanji Practice"],
    [],
  );

  const options = useMemo(() => ["Start", "Settings", "Help"], []);

  const back = useCallback(() => {
    if (gameMode != null) {
      setGameMode(null);
    }
    if (tab != null && gameMode == null) {
      setTab(null);
    }
  }, [gameMode, tab]);

  const selectOption = useCallback(
    (option) => {
      console.log("Selected:", option);

      switch (option) {
        case "Start":
          setTab("start");
          setSelected(0);
          break;

        case "Settings":
          // Open settings
          break;

        case "Help":
          setTab("help");
          break;

        default:
          break;
      }
    },
    [setTab],
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
      if (tab == null) {
        if (direction === "up") {
          setSelected((prev) => (prev - 1 + options.length) % options.length);
        }

        if (direction === "down") {
          setSelected((prev) => (prev + 1) % options.length);
        }
      } else if (tab === "start") {
        if (direction === "left") {
          setSelected((prev) => (prev - 1 + options.length) % options.length);
        }
        if (direction === "right") {
          setSelected((prev) => (prev + 1) % options.length);
        }
      }
    },
    [options.length, tab],
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
          if (tab == null) {
            selectOption(options[selected]);
          } else if (tab === "start") {
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
    tab,
    selectGameMode,
    back,
  ]);

  return (
    <main className="flex flex-col items-center min-h-screen p-2 overflow-hidden">
      <div className="flex flex-1 w-full flex-col bg-amber-50 p-10 rounded-2xl">
        {tab == null && (
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
        {tab == "start" && (
          <div className="flex flex-col flex-1 min-h-0">
            <p
              className="self-start mb-2 mx-2 text-black cursor-pointer"
              onClick={back}
            >
              &#10094;- Back
            </p>
            {gameMode === null && (
              <div className="flex flex-row flex-1 min-h-0">
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
            {gameMode === "drill" && <KanaDrill />})
          </div>
        )}
        {/*Settings*/}
        {tab == "help" && (
          <div className="flex flex-col items-center">
            <p
              className="self-start m-2 text-black cursor-pointer"
              onClick={back}
            >
              &#10094;- Back
            </p>
            <Help />
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
      className={`flex flex-col w-full min-h-0 border-2 p-4 mx-2 border-black ${selected ? `bg-green-300` : `bg-gray-500`}`}
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
