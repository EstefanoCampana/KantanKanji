"use client";

import { getKana } from "@/app/services/kantankanji-services";
import { useState, useEffect, useCallback, useRef } from "react";
import { GameCard } from "./GameCard";
import { formatTime, shuffleArray } from "@/utils/functions";
import Question from "./Question";
import Loading from "./Loading";
import RoundEndScreen from "./RoundEndScreen";
import PageLayout from "./PageLayout";

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
        filtered = filtered.filter((kana) =>
          kana.category.startsWith("hirada"),
        );
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
    return <Loading />;
  }
  return (
    <PageLayout title={"Kana Selection"} gameState={gameState}>
      {gameState == null && (
        <>
          <GameCard
            action={handleOnlyHiragana}
            color={"red"}
            image={"/kanaDrillThumb.png"}
            title={"Hiragana"}
            bestTime={hiraBestTime}
          />
          <GameCard
            action={handleOnlyKatakana}
            color={"green"}
            image={"/placeholder.png"}
            title={"Katakana"}
            bestTime={kataBestTime}
          />
        </>
      )}
      {gameState === "playing" && (
        <Question
          index={shuffledKana.length - currentIndex}
          time={(totalTime / 1000).toFixed(1)}
          question={currentKana?.character}
          questionSize={"100px"}
          input={true}
          inputHandler={handleInput}
          inputText={inputText}
          back={() => setGameState(null)}
        />
      )}
      {gameState === "finished" && (
        <RoundEndScreen
          totalTime={totalTime}
          bestTime={
            onlyHiragana ? formatTime(hiraBestTime) : formatTime(kataBestTime)
          }
          back={() => setGameState(null)}
        />
      )}
    </PageLayout>
  );
}
