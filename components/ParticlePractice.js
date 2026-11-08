"use client";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  getParticles,
  getNotNullSentences,
} from "@/app/services/kantankanji-services";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import Loading from "./Loading";
import PageLayout from "./PageLayout";
import { GameCard } from "./GameCard";
import Question from "./Question";

export default function ParticlePractice() {
  const INITIAL_TIME = 9999 * 1000;
  const [mode, setMode] = useState(null);
  const [grammarArray, setGrammarArray] = useState([]);
  const [particleArray, setParticleArray] = useState([]);
  const [counter, setCounter] = useState(null);
  const [totalTime, setTotalTime] = useState(INITIAL_TIME);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const [inputNumber, setInputNumber] = useState(10);
  const [inputText, setInputText] = useState("");
  const [questionsArray, setQuestionsArray] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [resultsArray, setResultsArray] = useState([]);
  const [resultsArrayInd, setResultsArrayInd] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const loadGrammar = async () => {
      try {
        const data = await getNotNullSentences();
        setGrammarArray(data);
      } catch (error) {
        console.error("Failed to load sentences:", error);
      }
    };

    loadGrammar();
  }, []);
  // Initialize kana
  useEffect(() => {
    const loadParticles = async () => {
      try {
        const data = await getParticles();
        setParticleArray(data);
      } catch (error) {
        console.error("Failed to load particles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadParticles();
  }, []);

  useEffect(() => {
    if (mode == null) return;
    if (grammarArray.length === 0) return;
    let random = Math.floor(Math.random() * grammarArray.length);
    let sliced = [...grammarArray.slice(random, random + inputNumber)];
    if (sliced.length < inputNumber) {
      sliced = [
        ...sliced,
        ...grammarArray.slice(0, inputNumber - sliced.length),
      ];
    }
    setQuestionsArray(sliced.sort(() => Math.random() - 0.5));
    setCounter(0);
  }, [mode, grammarArray, inputNumber]);

  const currentQuestion = useMemo(() => {
    if (counter == null || !questionsArray[counter]) return;
    return questionsArray[counter];
  }, [counter, questionsArray]);

  const blurredSentence = useMemo(() => {
    if (!currentQuestion) return;
    return currentQuestion.sentence.replace(currentQuestion.particle, "__");
  }, [currentQuestion]);

  const translation = currentQuestion?.translation ?? null;

  const answersArray = useMemo(() => {
    if (
      counter == null ||
      !questionsArray[counter] ||
      particleArray.length === 0
    )
      return;
    const correct = currentQuestion.particle;
    const array = [];
    particleArray.map((x) => array.push(x.character));
    const incorrect = array
      .filter((p) => p !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    return [correct, ...incorrect].sort(() => Math.random() - 0.5);
  }, [currentQuestion, particleArray, counter, questionsArray]);

  const handleTextInput = (event) => {
    setInputText(event.target.value);
  };
  const handleNumberInput = (event) => {
    let value = Number(event.target.value);
    if (value >= 1) {
      setInputNumber(value);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setInputText("");
      if (inputText === questionsArray[counter].particle) {
        resetTimer();
        setCounter((prev) => prev + 1);
        setResultCount((prev) => prev + 1);
      } else {
        let wrongAnswer = {
          particleG: questionsArray[counter].particle,
          particleW: inputText,
          sentence: blurredSentence,
        };
        setResultsArray((prev) => [...prev, wrongAnswer]);
        resetTimer();
        setCounter((prev) => prev + 1);
      }
    }
  };

  const handleInput = (particle) => {
    if (particle === questionsArray[counter].particle) {
      resetTimer();
      setCounter((prev) => prev + 1);
      setResultCount((prev) => prev + 1);
    } else {
      let wrongAnswer = {
        particleG: questionsArray[counter].particle,
        particleW: particle,
        sentence: blurredSentence,
      };
      setResultsArray((prev) => [...prev, wrongAnswer]);
      resetTimer();
      setCounter((prev) => prev + 1);
    }
  };

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = INITIAL_TIME - elapsed;

      setTotalTime((prev) => (remaining <= 0 ? 0 : remaining));

      if (remaining <= 0) {
        clearInterval(timerRef.current);
      }
    }, 10);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const resetTimer = useCallback(() => {
    setTotalTime(INITIAL_TIME);
    startTimer();
  }, [startTimer, INITIAL_TIME]);

  useEffect(() => {
    if (totalTime == 0) {
      resetTimer();
      handleInput(totalTime);
    }
  }, [totalTime]);

  useEffect(() => {
    setCounter(null);
  }, [inputNumber]);

  useEffect(() => {
    if (mode === "easy" || mode === "hard") {
      resetTimer();
    } else {
      stopTimer();
    }
    return () => clearInterval(timerRef.current);
  }, [mode, resetTimer, stopTimer]);

  useEffect(() => {
    if (
      counter !== null &&
      questionsArray.length > 0 &&
      counter >= questionsArray.length
    ) {
      stopTimer();
      setMode("results");
    }
  }, [counter, questionsArray, stopTimer]);

  useEffect(() => {
    if (mode == null) {
      stopTimer();
      setResultCount(0);
      setInputNumber(10);
      setResultsArray([]);
    }
  }, [mode]);

  const changeGame = useCallback(
    (direction) => {
      if (direction === "left") {
        setSelected(
          (prev) => (prev - 1 + answersArray.length) % answersArray.length,
        );
      }
      if (direction === "right") {
        setSelected((prev) => (prev + 1) % answersArray.length);
      }
    },
    [answersArray],
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

      if (mode == null) return;

      switch (event.key.toLowerCase()) {
        case "enter":
          setSelected(answersArray[selected]);
          break;

        case "arrowleft":
          changeGame("left");
          break;

        case "arrowright":
          changeGame("right");
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [changeGame, selected, setSelected, answersArray]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <PageLayout title={"Levels"} gameState={mode}>
      {mode == null && (
        <>
          <GameCard
            action={() => setMode("easy")}
            color={"green"}
            image={"/placeholder.png"}
            title={"Level 1"}
          />
          <GameCard
            action={() => setMode("hard")}
            color={"red"}
            image={"/placeholder.png"}
            title={"Level 2"}
          />
        </>
      )}
      {mode === "hard" && (
        <Question
          index={`${counter + 1}.${translation}`}
          time={(totalTime / 1000).toFixed(0)}
          question={blurredSentence}
          questionSize={"25px"}
          answerArray={answersArray}
          back={() => setMode(null)}
          optionSelected={selected}
        />
      )}
      {mode === "results" && (
        <div className="flex flex-col justify-center items-center">
          <p className="text-2xl font-black text-black text-center">Results!</p>
          <div className="flex flex-col text-black p-5 ">
            <p className="text-md font-bold">
              Questions Answered: {resultCount} / {inputNumber}
            </p>
            <p className="font-bold text-md">
              Wrong Answers: {inputNumber - resultCount}
            </p>
            {resultsArray.length > 0 && (
              <div className="flex flex-row m-4">
                <GrCaretPrevious
                  className="self-center"
                  onClick={() =>
                    setResultsArrayInd((prev) => (prev > 0 ? prev - 1 : 0))
                  }
                />
                <div className="flex flex-col md:flex-row w-full max-w-md border border-black rounded-2xl p-3 gap-3">
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-center">
                      Question {resultsArrayInd + 1}.
                    </p>
                    <p className="text-sm text-center">
                      {resultsArray[resultsArrayInd]?.sentence}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-center">Your Answer</p>
                    <p className="text-sm text-center">
                      {resultsArray[resultsArrayInd]?.particleW === 0
                        ? "‎"
                        : resultsArray[resultsArrayInd]?.particleW}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-center">
                      Actual Answer
                    </p>
                    <p className="text-sm text-center">
                      {resultsArray[resultsArrayInd]?.particleG}
                    </p>
                  </div>
                </div>
                <GrCaretNext
                  className="self-center"
                  onClick={() =>
                    setResultsArrayInd((prev) =>
                      prev < resultsArray.length - 1 ? prev + 1 : 0,
                    )
                  }
                />
              </div>
            )}
          </div>
          <button
            className="bg-black hover:bg-black/90 text-white font-black p-5 rounded-2xl"
            onClick={() => setMode(null)}
          >
            Return Home
          </button>
        </div>
      )}
    </PageLayout>
  );
}
