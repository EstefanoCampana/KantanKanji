"use client";

import { getKana } from "@/app/services/kantankanji-services";
import { useState, useEffect, useCallback } from "react";

// Fisher-Yates shuffle
function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default function KanaDrillComp() {
  const [inputText, setInputText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [onlyHiragana, setOnlyHiragana] = useState(false);
  const [onlyKatakana, setOnlyKatakana] = useState(false);

  const [fullKana, setFullKana] = useState([]);
  const [shuffledKana, setShuffledKana] = useState([]);
  const [isRoundOver, setIsRoundOver] = useState(true);
  const currentKana = shuffledKana[currentIndex];

  // Initialize kana
  useEffect(() => {
    const loadKana = async () => {
      const data = await getKana();
      setFullKana(data);
    };
    loadKana();
  }, []);

  // Create a new deck based on the selected filter
  const createNewDeck = useCallback(
    (filter) => {
      let filtered = [...fullKana];
      if (filter === "hira") {
        filtered = filtered.filter((kana) => kana.category.startsWith("hira"));
      }
      if (filter === "kata") {
        filtered = filtered.filter((kana) => kana.category.startsWith("kata"));
      }
      setShuffledKana(shuffleArray(filtered));
      setCurrentIndex(0);
      setInputText("");
      setIsRoundOver(false);
      setOnlyHiragana(false);
      setOnlyKatakana(false);
    },
    [fullKana],
  );

  // Toggle Katakana
  const handleOnlyKatakana = useCallback(() => {
    setOnlyKatakana(true);

    createNewDeck("kata");
  }, [createNewDeck]);

  // Toggle Hiragana
  const handleOnlyHiragana = useCallback(() => {
    setOnlyHiragana(true);

    createNewDeck("hira");
  }, [createNewDeck]);

  // Start a new shuffled round
  const restartRound = () => {
    setShuffledKana(shuffleArray(shuffledKana));
    setRandomIndex(0);
    setInputText("");
  };

  // Handle user input
  const handleInput = (event) => {
    setInputText(event.target.value.toLowerCase());
    if (event.target.value.toLowerCase() === currentKana?.reading) {
      setInputText("");
      if (currentIndex < shuffledKana.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
      if (currentIndex === shuffledKana.length - 1) {
        setIsRoundOver(true);
      }
    }
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

      switch (event.key.toLowerCase()) {
        case "h":
          handleOnlyHiragana();
          break;

        case "k":
          handleOnlyKatakana();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    onlyHiragana,
    onlyKatakana,
    fullKana,
    shuffledKana,
    handleOnlyHiragana,
    handleOnlyKatakana,
  ]);
  return (
    <div className="flex flex-col bg-amber-50 p-2 rounded-2xl w-full">
      <div className="flex flex-col bg-gray-300 rounded-2xl p-2 items-center">
        {!isRoundOver ? (
          <div className="flex-col w-full flex p-4 my-4 self-center items-center bg-white border-2 rounded-2xl border-black">
            <div className="text-black flex flex-row gap-2">
              <p>{shuffledKana.length - currentIndex}</p>
              <p></p>
            </div>
            <p className="text-5xl text-center text-black font-bold pb-2">
              {currentKana?.character}
            </p>
            <input
              placeholder="入力"
              onChange={handleInput}
              maxLength={3}
              value={inputText}
              className="border-2 border-black text-black rounded-lg align-middle text-center bg-gray-300"
              autoFocus
            ></input>
            <button
              onClick={() => setIsRoundOver(true)}
              className="bg-black text-white font-bold rounded 2xl p-2 mt-2"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col">
            <p className="text-2xl font-black text-black text-center">
              Kana Selection
            </p>
            <div className="flex flex-row justify-evenly py-2">
              <button
                onClick={handleOnlyHiragana}
                className="px-4 py-2 rounded-md bg-red-500 font-black hover:bg-red-500/50"
              >
                Hiragana
              </button>
              <button
                onClick={handleOnlyKatakana}
                className="px-4 py-2 rounded-md bg-green-400 font-black hover:bg-green-400/50"
              >
                Katakana
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
