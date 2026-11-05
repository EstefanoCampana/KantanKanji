"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import Help from "@/components/Help";
import Game from "@/components/Games";

export default function Home() {
  const [selected, setSelected] = useState(0);
  const [gameMode, setGameMode] = useState(null);
  const [tab, setTab] = useState(null);

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

  const changeOption = useCallback(
    (direction) => {
      if (direction === "up") {
        setSelected((prev) => (prev - 1 + options.length) % options.length);
      }

      if (direction === "down") {
        setSelected((prev) => (prev + 1) % options.length);
      }
    },
    [options.length],
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
          selectOption(options[selected]);
          break;

        case "arrowup":
          changeOption("up");
          break;

        case "arrowdown":
          changeOption("down");
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
  }, [changeOption, selectOption, options, selected, back]);

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
            <Game gameMode={gameMode} setGameMode={setGameMode} />
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
