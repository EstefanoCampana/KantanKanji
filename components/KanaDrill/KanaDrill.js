"use client";

import { useState, useEffect } from "react";
import Loading from "../Loading";
import Question from "../Question";
import { shuffleArray } from "@/utils/functions";
import { getHiragana, getKatakana } from "@/app/services/kantankanji-services";
import { useTimer } from "@/app/hooks/useTimer";
import RoundEndScreen from "../RoundEndScreen";

export default function KanaDrill({ kana }) {
  //Array gotten from the api call.
  const [kanaArray, setKanaArray] = useState([]);
  //Array shuffled and used in this component.
  const [shuffledKana, setShuffledKana] = useState([]);
  //Index of the current kana
  const [currentIndex, setCurrentIndex] = useState(0);
  //Input variable
  const [inputText, setInputText] = useState("");
  //Bool check if page has loaded all kana.
  const [isLoading, setIsLoading] = useState(true);
  //
  const [gameState, setGameState] = useState(null);
  //Current kana displayed on screen
  const currentKana = shuffledKana[currentIndex];

  const { totalTime, startTimer, stopTimer } = useTimer();
  const [bestTime, setBestTime] = useState(0);

  // Initialize kana
  useEffect(() => {
    const loadKana = async () => {
      try {
        if (kana === "hiragana") {
          const data = await getHiragana();
          setKanaArray(data);
        } else if (kana === "katakana") {
          const data = await getKatakana();
          setKanaArray(data);
        }
      } catch (error) {
        console.error("Failed to load kana:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadKana();
  }, [kana]);

  // Initialize round.
  useEffect(() => {
    const init = () => {
      setShuffledKana(shuffleArray(kanaArray));
      setCurrentIndex(0);
      setInputText("");
      setGameState(null);
      startTimer();
    };

    init();
  }, [kanaArray, startTimer]);

  const finalizeRound = () => {
    const elapsed = stopTimer();
    setGameState("finished");
    if (elapsed <= bestTime || bestTime === 0) {
      setBestTime(elapsed);
    }
  };

  // Handle user input and moving through the array.
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
      finalizeRound();
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {gameState == null ? (
        <Question
          index={shuffledKana.length - currentIndex}
          question={currentKana?.character}
          time={(totalTime / 1000).toFixed(1)}
          questionSize={"100px"}
          input={true}
          inputHandler={handleInput}
          inputText={inputText}
        />
      ) : (
        <RoundEndScreen totalTime={totalTime} bestTime={bestTime} />
      )}
    </>
  );
}
