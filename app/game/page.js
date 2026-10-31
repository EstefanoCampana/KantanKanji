"use client";
import KanaDrillComp from "@/components/KanaDrill";
import { useCallback, useEffect, useState, useMemo } from "react";
export default function Game() {
  const [selected, setSelected] = useState(0);
  const [start, setStart] = useState(false);

  const options = useMemo(() => ["Start", "Settings", "Help"], []);

  const selectOption = useCallback(
    (option) => {
      console.log("Selected:", option);

      switch (option) {
        case "Start":
          setStart(true);
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

      switch (event.key) {
        case "Enter":
          selectOption(options[selected]);
          break;

        case "ArrowUp":
          changeOption("up");
          break;

        case "ArrowDown":
          changeOption("down");
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [changeOption, selectOption, options, selected]);
  return (
    <main className="flex flex-col items-center p-2 min-h-dvh w-full overflow-hidden">
      <div className="flex-1 w-full flex-col justify-items-center bg-amber-50 p-4 rounded-2xl">
        {start ? (
          <KanaDrillComp />
        ) : (
          <div className="flex flex-col w-full items-center">
            <div className="flex flex-row mb-10">
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
            <div className="w-1/2">
              {options.map((option, id) => (
                <Option
                  key={id}
                  text={option}
                  selected={selected === id}
                ></Option>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Option({ text, selected = false }) {
  return (
    <div
      className={`text-black border border-black p-4 rounded-xl m-4 w-full text-center ${selected ? `bg-green-300` : `bg-gray-300`}`}
    >
      {text}
    </div>
  );
}
