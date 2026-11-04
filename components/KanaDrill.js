"use client";

import { getKana } from "@/app/services/kantankanji-services";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
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

export default function KanaDrill() {
  //Array filled by the API
  const [fullKana, setFullKana] = useState([]);
  //Input variable
  const [inputText, setInputText] = useState("");
  //Index of the current kana
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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
      try {
        const data = await getKana();
        setFullKana(data);
      } catch (error) {
        console.error("Failed to load kana:", error);
      } finally {
        setIsLoading(false);
      }
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
        filtered = filtered.filter((kana) => kana.category.startsWith("hira"));
      }
      if (filter === "kata") {
        filtered = filtered.filter((kana) => kana.category.startsWith("kata"));
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

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-300 rounded-2xl">
        <p className="text-black text-xl font-bold">Loading Kana...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-1 bg-gray-300 rounded-2xl p-2">
      {gameState == null && (
        <div className="flex flex-1 flex-col min-h-0">
          <p className="text-2xl font-black text-black text-center">
            Kana Selection
          </p>
          <div className="flex flex-row flex-1 justify-evenly my-auto min-h-0">
            <div
              className={`flex flex-col flex-1 min-h-0 p-4 mx-2 bg-red-500 hover:bg-red-500/50`}
              onClick={handleOnlyHiragana}
            >
              <div></div>
              <div className="relative flex-1 min-h-0 overflow-hidden">
                <Image
                  className="object-cover"
                  src="/kanaDrillThumb.png"
                  alt="thumbnail"
                  fill
                  sizes="(max-width:768px) 100vw, 250px"
                ></Image>
              </div>
              <div className="flex py-2 shrink-0">
                <h1 className="text-white font-black">
                  Hiragana <br />
                  <p className="font-medium">{formatTime(hiraBestTime)}</p>
                </h1>
              </div>
            </div>
            <div
              className={`flex flex-col flex-1 min-h-0 p-4 mx-2 bg-green-500 hover:bg-green-500/50`}
              onClick={handleOnlyKatakana}
            >
              <div></div>
              <div className="relative flex-1 min-h-0 overflow-hidden">
                <Image
                  className="object-cover"
                  src="/kanaDrillThumb.png"
                  alt="thumbnail"
                  fill
                  sizes="(max-width:768px) 100vw, 250px"
                ></Image>
              </div>
              <div className="flex py-2 shrink-0">
                <h1 className="text-white font-black">
                  Katakana <br />
                  <p className="font-medium">{formatTime(kataBestTime)}</p>
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}
      {gameState === "playing" && (
        <div className="flex flex-1 w-full flex-col p-4 items-center bg-white border-2 rounded-2xl border-black">
          <div className="text-black flex flex-row gap-2 items-center my-auto">
            <p className="border-2 border-black rounded-xl px-2 m-2">
              {shuffledKana.length - currentIndex}
            </p>
            <p className="border-2 border-amber-50/0">
              {(totalTime / 1000).toFixed(1)}
            </p>
          </div>
          <div className="my-auto">
            <p className="text-[100px] border-4 text-center text-black font-bold mb-4">
              {currentKana?.character}
            </p>
            <input
              placeholder="入力"
              onChange={handleInput}
              maxLength={3}
              value={inputText}
              className="border-2 w-full border-black text-black rounded-lg text-center bg-gray-300"
              autoFocus
            ></input>
          </div>

          <button
            onClick={() => setGameState(null)}
            className="bg-black text-white font-bold rounded 2xl p-2 my-auto"
          >
            Back
          </button>
        </div>
      )}
      {gameState === "finished" && (
        <div className="flex flex-col items-center my-auto">
          <p className="text-black font-extrabold text-2xl">
            You finished in {formatTime(totalTime)}!
          </p>
          <p className="text-black font-medium">
            Your best time is{" "}
            {onlyHiragana ? formatTime(hiraBestTime) : formatTime(kataBestTime)}
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
  );
}
