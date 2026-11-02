"use client";

import { getKana } from "@/app/services/kantankanji-services";
import { useState, useEffect, useCallback, useRef, use } from "react";

// Fisher-Yates shuffle
function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds % 1000)}`;
}

export default function KanaDrillComp() {
  //Array filled by the API
  const [fullKana, setFullKana] = useState([]);
  //Input variable
  const [inputText, setInputText] = useState("");
  //Index of the current kana
  const [currentIndex, setCurrentIndex] = useState(0);
  //Mode Controllers
  const [onlyHiragana, setOnlyHiragana] = useState(false);
  const [onlyKatakana, setOnlyKatakana] = useState(false);
  //Array shuffled and used in this component.
  const [shuffledKana, setShuffledKana] = useState([]);
  //Round over controller
  const [gameState, setGameState] = useState(null);
  //Current kana displayed on screen
  const currentKana = shuffledKana[currentIndex];
  //Timer Variables
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const [totalTime, setTotalTime] = useState(0);
  const [hiraBestTime, setHiraBestTime] = useState(0);
  const [kataBestTime, setKataBestTime] = useState(0);

  // Initialize kana
  useEffect(() => {
    const loadKana = async () => {
      const data = await getKana();
      setFullKana(data);
    };
    loadKana();
  }, []);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);

    setTotalTime(0);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTotalTime(Date.now() - startTimeRef.current);
    }, 10);
  }, []);

  const stopTimer = useCallback(() => {
    if (startTimeRef.current === null) return;
    const elapsed = Date.now() - startTimeRef.current;

    setTotalTime(elapsed);
    clearInterval(timerRef.current);
    startTimeRef.current = null;
    timerRef.current = null;

    return elapsed;
  }, []);

  // Create a new deck based on the selected filter
  const createNewDeck = useCallback(
    (filter) => {
      let filtered = [...fullKana];
      if (filter === "hira") {
        filtered = filtered.filter((kana) =>
          kana.category.startsWith("hirada"),
        );
      }
      if (filter === "kata") {
        filtered = filtered.filter((kana) =>
          kana.category.startsWith("katada"),
        );
      }
      setShuffledKana(shuffleArray(filtered));
      setCurrentIndex(0);
      setInputText("");
      setGameState("playing");
      startTimer();
    },
    [fullKana, startTimer],
  );

  // Toggle Katakana
  const handleOnlyKatakana = useCallback(() => {
    createNewDeck("kata");
    setOnlyKatakana(true);
    setOnlyHiragana(false);
  }, [createNewDeck]);

  // Toggle Hiragana
  const handleOnlyHiragana = useCallback(() => {
    createNewDeck("hira");
    setOnlyHiragana(true);
    setOnlyKatakana(false);
  }, [createNewDeck]);

  // Handle user input
  const handleInput = (event) => {
    setInputText(event.target.value.toLowerCase());
    if (event.target.value.toLowerCase() === currentKana?.reading) {
      setInputText("");
    } else {
      return;
    }
    if (currentIndex < shuffledKana.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    if (currentIndex === shuffledKana.length - 1) {
      setGameState("finished");
      const elapsed = stopTimer();
      if (onlyHiragana) {
        if (elapsed <= hiraBestTime || hiraBestTime === 0) {
          setHiraBestTime(elapsed);
        }
      }
      if (onlyKatakana) {
        if (elapsed <= kataBestTime || kataBestTime === 0) {
          setKataBestTime(elapsed);
        }
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
  }, [fullKana, shuffledKana, handleOnlyHiragana, handleOnlyKatakana]);

  useEffect(() => {
    if (gameState === "finished") {
      stopTimer();
    }
  }, [gameState, stopTimer]);
  return (
    <div className="flex flex-col bg-amber-50 p-2 rounded-2xl w-full">
      <div className="flex flex-col bg-gray-300 rounded-2xl p-2 items-center">
        {gameState == null && (
          <div className="flex w-full flex-col">
            <p className="text-2xl font-black text-black text-center">
              Kana Selection
            </p>
            <div className="flex flex-row justify-evenly py-2">
              <button
                onClick={handleOnlyHiragana}
                className="px-4 py-2 rounded-md bg-red-500 font-black hover:bg-red-500/50"
              >
                Hiragana <br />
                <p className="font-medium">{formatTime(hiraBestTime)}</p>
              </button>
              <button
                onClick={handleOnlyKatakana}
                className="px-4 py-2 rounded-md bg-green-500 font-black hover:bg-green-500/50"
              >
                Katakana <br />
                <p className="font-medium">{formatTime(kataBestTime)}</p>
              </button>
            </div>
          </div>
        )}
        {gameState === "playing" && (
          <div className="flex-col w-full flex p-4 my-4 self-center items-center bg-white border-2 rounded-2xl border-black">
            <div className="text-black flex flex-row gap-2 items-center">
              <p className="border-2 border-black rounded-xl px-2 m-2">
                {shuffledKana.length - currentIndex}
              </p>
              <p className="border-2 border-amber-50/0">
                {(totalTime / 1000).toFixed(1)}
              </p>
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
              onClick={() => setGameState(null)}
              className="bg-black text-white font-bold rounded 2xl p-2 mt-2"
            >
              Back
            </button>
          </div>
        )}
        {gameState === "finished" && (
          <div className="flex flex-col items-center">
            <p className="text-black font-extrabold text-2xl">
              You finished in {formatTime(totalTime)}!
            </p>
            <p className="text-black font-medium">
              Your best time is{" "}
              {onlyHiragana
                ? formatTime(hiraBestTime)
                : formatTime(kataBestTime)}
            </p>
            <button
              onClick={() => setGameState(null)}
              className="bg-black text-white font-bold rounded 2xl p-2 mt-2"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
