"use client";
import { useCallback } from "react";
import Help from "@/components/Help";
import Game from "@/components/Games";

import SentenceStructure from "@/components/SentenceStructure";
import ParticlePractice from "@/components/ParticlePractice";

import { useNavigation } from "./context/NavigationContext";
import { useKeyboard } from "./context/KeyboardContext";
import { useMenuNavigation } from "./hooks/useMenuNavigation";

import BackButton from "@/components/BackButton";
import KanaDrill from "@/components/KanaDrill/KanaDrill";
import KanaDrillMenu from "@/components/KanaDrill/KanaDrillMenu";

const OPTIONS = ["Start", "Settings", "Help"];

export default function Home() {
  const { currentRoute, navigate } = useNavigation();

  const { selected, setSelected, moveSelection } = useMenuNavigation(
    OPTIONS.length,
  );

  const selectOption = useCallback(
    (option) => {
      console.log("Selected:", option);
      const routes = {
        Start: "games",
        Settings: "settings",
        Help: "help",
      };

      if (routes[option]) {
        navigate(routes[option]);
      }
    },
    [navigate],
  );
  const handleKeyboard = useCallback(
    (event) => {
      switch (event.key.toLowerCase()) {
        case "enter":
          selectOption(OPTIONS[selected]);
          break;

        case "arrowup":
          moveSelection("up");
          break;

        case "arrowdown":
          moveSelection("down");
          break;

        default:
          break;
      }
    },
    [selected, selectOption, moveSelection],
  );

  useKeyboard(handleKeyboard, currentRoute === "home");
  return (
    <main className="flex flex-col items-center min-h-screen p-2 overflow-hidden">
      <div className="flex flex-1 w-full flex-col bg-amber-50 p-10 rounded-2xl">
        {currentRoute === "home" && (
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
              {OPTIONS.map((option, id) => (
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
                <p>↑ / ↓ - Move</p>
                <p>Enter - Select</p>
              </div>

              <div>
                <p>Left Click - Select</p>
              </div>
            </div>
          </div>
        )}
        <div
          className={
            currentRoute === "games" ? "flex flex-1 min-h-0" : "hidden"
          }
        >
          <div className="flex flex-col flex-1 min-h-0">
            <BackButton />
            <Game />
          </div>
        </div>

        {currentRoute === "help" && (
          <div className="flex flex-col flex-1">
            <BackButton />
            <Help />
          </div>
        )}
        <div
          className={
            currentRoute === "drill" ? "flex flex-1 min-h-0" : "hidden"
          }
        >
          <div className="flex flex-col flex-1 min-h-0">
            <BackButton />
            <KanaDrillMenu />
          </div>
        </div>

        {currentRoute === "hiragana" && (
          <div className="flex flex-col flex-1 min-h-0">
            <KanaDrill kana={"hiragana"} />
          </div>
        )}

        {currentRoute === "katakana" && (
          <div className="flex flex-col flex-1 min-h-0">
            <KanaDrill kana={"katakana"} />
          </div>
        )}

        {currentRoute === "customDrill" && (
          <div className="flex flex-col flex-1 min-h-0">
            <KanaDrill kana={"custom"} />
          </div>
        )}

        {currentRoute === "particle" && (
          <div className="flex flex-col flex-1 min-h-0">
            <BackButton />
            <ParticlePractice />
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
