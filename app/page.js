"use client";

import { useCallback } from "react";
import { useNavigation } from "./context/NavigationContext";
import { useKeyboard } from "./context/KeyboardContext";
import { useMenuNavigation } from "./hooks/useMenuNavigation";
import { useMediaQuery } from "@/components/UseMediaQuery";
import { useLanguage } from "./context/LanguageContext";
import { useSettings } from "./context/SettingsContext";

import BackButton from "@/components/BackButton";
import KanaDrill from "@/components/KanaDrill/KanaDrill";
import KanaDrillMenu from "@/components/KanaDrill/KanaDrillMenu";
import KanaDrillSettings from "@/components/KanaDrill/KanaDrillSettings";

import Help from "@/components/Help";
import Game from "@/components/Games";
import GeneralSettings from "@/components/GeneralSettings";

import SentenceStructure from "@/components/SentenceStructure";
import ParticlePractice from "@/components/ParticlePractice";

import { Title } from "@/components/Text";
import Loading from "@/components/Loading";

const OPTIONS = ["Start", "Settings", "Help"];

export default function Home() {
  const { currentRoute, navigate } = useNavigation();
  const small = useMediaQuery("(max-width: 768px)");
  const { textArray } = useLanguage();
  const { isHydrated } = useSettings();

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
  if (!isHydrated) return <Loading />;
  return (
    <main className="flex flex-col items-center min-h-screen p-2 overflow-hidden">
      <div className="flex flex-1 w-full flex-col bg-amber-50 p-10 rounded-2xl overflow-hidden">
        {currentRoute === "home" && (
          <div className="flex flex-1 flex-col items-center mb-auto">
            <div className="flex flex-row text-center">
              <Title text={textArray[0]} />
            </div>
            <div className="w-full md:w-1/2 mt-auto">
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
              <div className="flex flex-col">
                <p>← / → / ↑ / ↓ - Move</p>
                <p>Enter - Select</p>
                <p>Left Click - Select</p>
              </div>

              <div></div>
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

        {currentRoute === "settings" && (
          <div className="flex flex-col flex-1">
            <BackButton />
            <GeneralSettings />
          </div>
        )}

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
            {small && <BackButton />}
            <KanaDrill kana={"hiragana"} />
          </div>
        )}

        {currentRoute === "katakana" && (
          <div className="flex flex-col flex-1 min-h-0">
            {small && <BackButton />}
            <KanaDrill kana={"katakana"} />
          </div>
        )}

        {currentRoute === "customDrill" && (
          <div className="flex flex-col flex-1 min-h-0">
            {small && <BackButton />}
            <KanaDrillSettings />
          </div>
        )}

        {currentRoute === "customDrillGame" && (
          <div className="flex flex-col flex-1 min-h-0">
            {small && <BackButton />}
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
      className={`text-black border border-black p-6 my-2 w-full text-center ${selected ? `bg-white ring-4 ring-cyan-600` : `bg-gray-300 text-black`}`}
      onClick={action}
    >
      {text}
    </button>
  );
}
