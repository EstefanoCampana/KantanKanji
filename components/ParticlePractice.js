"use client"
import { useMemo, useState, useEffect, useRef, useCallback } from "react"
import grammar from "../dataFiles/grammar.json"
import { TimerOff } from "lucide";
import { getParticles } from "@/app/services/kantankanji-services";
import { querySnapshotFromJSON } from "firebase/firestore";

export default function ParticlePracticeComp() {
    const INITIAL_TIME = 15 * 1000;
    const [mode, setMode] = useState(null);
    const [grammarArray, setGrammarArray] = useState(grammar)
    const [particleArray, setParticleArray] = useState([])
    const [counter, setCounter] = useState(null);
    const [totalTime, setTotalTime] = useState(INITIAL_TIME);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const [inputText, setInputText] = useState("");
    const [inputNumber, setInputNumber] = useState(10);
    const [questionsArray, setQuestionsArray] = useState([]);
    const [answersArray, setAnswersArray] = useState([]); 

    const currentSentence = useRef(null);
    const currentTranslation = useRef(null);
    
    useEffect(() => {
        if(mode == null) return;
        let random = Math.floor(Math.random() * grammarArray.length);
        let sliced = [...grammarArray.slice(random, random + inputNumber)]
        if(sliced.length < inputNumber){
            sliced = [...sliced,...grammarArray.slice(0,inputNumber - sliced.length)]
        }
        setQuestionsArray(sliced.sort(() => Math.random() - 0.5));
        setCounter(0);
    }, [mode, grammarArray, inputNumber])

    useEffect(() => {
        if (
            counter == null ||
            !questionsArray[counter] ||
            particleArray.length === 0
        ) {
            currentSentence.current = null;
            currentTranslation.current = null;
            setAnswersArray([]);
            return;
            }
        }, []
    )
   useEffect(() => {
    console.log(questionsArray)
        if(counter == null || !questionsArray[counter] || particleArray.length === 0) return;
        const correct = questionsArray[counter].particle;
        const incorrect = particleArray.filter(p => p !== correct).sort(() => Math.random() - 0.5).slice(0,3);
        const answers = [correct, ...incorrect].sort(() => Math.random() - 0.5);
        currentSentence.current = questionsArray[counter].sentence.replace(correct, "‎__‎");
        currentTranslation.current = questionsArray[counter].translation;
        setAnswersArray(answers);
    }, [particleArray, questionsArray, counter])
    
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
            if (inputText === questionsArray[counter].particle) {
                resetTimer();
                setInputText("");
                setCounter(prev => prev + 1 < questionsArray.length ? prev + 1 : prev);
            }
        }
    }

    const handleInput = (particle) => {
        if (particle === questionsArray[counter].particle) {
            resetTimer();
            setCounter(prev => prev + 1 < questionsArray.length ? prev + 1 : prev);
        }
    }

    const startTimer = useCallback(() => {
        clearInterval(timerRef.current);
        startTimeRef.current = Date.now();

        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = INITIAL_TIME - elapsed;

            setTotalTime(prev => remaining <= 0 ? 0 : remaining);

            if (remaining <= 0) {
                clearInterval(timerRef.current);
            }
        }, 10);
    }, [])

    const resetTimer = useCallback(() => {
        setTotalTime(INITIAL_TIME);
        startTimer();
    }, [startTimer, INITIAL_TIME])

    useEffect(() => {
        getParticles(setParticleArray);
    }, []);

    useEffect(() => {
        if(totalTime == 0) {
            resetTimer();
            setCounter(prev => prev + 1 < questionsArray.length ? prev + 1 : prev);
        };
    }, [totalTime]);

    useEffect(() => {
        setCounter(null);
    }, [inputNumber]);

    useEffect(() => {
        if (mode == null) return;
        resetTimer();
        return () => clearInterval(timerRef.current);
    }, [mode, resetTimer]);


    return (
        <div className="flex flex-col bg-amber-50 my-4 md:px-10 p-5 h-65 justify-center rounded-2xl">
            {mode == null && (
                <div className="flex flex-col bg-gray-300 rounded-2xl p-5">
                    <p className="text-2xl font-black text-black text-center">Mode Selection</p>
                    <div className="flex flex-row justify-evenly py-10">
                        {mode !== "easy" && (
                            <button onClick={() => setMode("easy")} className="px-5 py-2 rounded-md bg-green-400 font-black hover:bg-green-400/50">Easy</button>
                        )}
                        {mode !== "hard" && (
                            <button onClick={() => setMode("hard")} className="px-5 py-2 rounded-md bg-red-500 font-black hover:bg-red-500/50">Hard</button>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <label className="text-md text-black pr-1">No. Questions: </label>
                        <input onChange={handleNumberInput} min="0" type="number" placeholder="10" className="border border-black text-center text-black rounded-lg"></input>
                    </div>
                </div>
            )}
            {mode === "easy" && (
                <div className="flex flex-col w-full">
                    <div className="flex flex-row text-black ">
                        <p className="text-md">{counter+1}. {currentTranslation.current}</p>
                        <p className="ml-auto font-bold">{(totalTime / 1000).toFixed(0)}</p>
                    </div>

                    <div className="flex mx-4 p-5 m-5 self-center items-center justify-center bg-gray-300 rounded-2xl border-2 border-black">
                        <p className="text-center text-black font-bold">{currentSentence.current}</p>
                    </div>

                    <div className="grid grid-flow-dense grid-rows-2 grid-cols-2 gap-2">
                        {answersArray?.map((particle, id) => (
                            <button value={particle} onClick={() => handleInput(particle)} className="py-1 rounded-md bg-red-500 border-gray-200 border-2 hover:bg-red-500/50" key={id}>{particle}</button>
                        ))}
                    </div>
                </div>
            )}
            {mode === "hard" && (
                <div className="flex flex-col w-full">
                    <div className="flex flex-row text-black ">
                        <p className="text-md">{counter+1}. {currentTranslation.current}</p>
                        <p className="ml-auto font-bold">{(totalTime / 1000).toFixed(0)}</p>
                    </div>

                    <div className="flex mx-4 p-5 m-5 self-center items-center justify-center bg-gray-300 rounded-2xl border-2 border-black">
                        <p className="text-center text-black font-bold">{currentSentence.current}</p>
                    </div>

                    <div className="flex items-center justify-center">
                        <input placeholder="入力" onChange={handleTextInput} onKeyDown={handleKeyDown} value={inputText} className="border-2 border-black align-middle text-center text-black"></input>
                    </div>
                </div>
            )}
        </div>
    )
}

