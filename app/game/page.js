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
  const back = () => {
    setStart(false);
  };
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
  }, [changeOption, selectOption, options, selected]);

  return (
    <main className="flex flex-col items-center min-h-screen p-2 overflow-hidden">
      <div className="flex flex-1 w-full flex-col bg-amber-50 p-4 rounded-2xl">
        {start ? (
          <div>
            <p className="self-start text-black cursor-pointer" onClick={back}>
              &#10094;- Back
            </p>
            <KanaDrillComp />
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
