"use client"
import { useMemo, useState, useEffect, useRef, useCallback } from "react"
import grammar from "../dataFiles/grammar.json"
import { getParticles } from "@/app/services/kantankanji-services";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

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
    const [resultCount, setResultCount] = useState(0);
    const [resultsArray, setResultsArray] = useState([]);
    const [resultsArrayInd, setResultsArrayInd] = useState(0);
    
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

   const currentQuestion = useMemo(() => {
    if (counter == null || !questionsArray[counter]) return;
    return questionsArray[counter];
   }, [counter, questionsArray]);

   const blurredSentence = useMemo(() => {
    if(!currentQuestion) return;
    return currentQuestion.sentence.replace(currentQuestion.particle, "__");
   }, [currentQuestion]);

   const translation = currentQuestion?.translation ?? null;

   const answersArray = useMemo(() => {
        if(counter == null || !questionsArray[counter] || particleArray.length === 0) return;
        const correct = currentQuestion.particle;
        const incorrect = particleArray.filter(p => p !== correct).sort(() => Math.random() - 0.5).slice(0,3);
        return [correct, ...incorrect].sort(() => Math.random() - 0.5);
    }, [currentQuestion, particleArray])
    
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
                setCounter(prev => prev + 1);
                setResultCount(prev => prev + 1);
            }        
            else
            {
                let wrongAnswer = {
                    particleG: questionsArray[counter].particle,
                    particleW: inputText,
                    sentence: blurredSentence
                }
                setResultsArray(prev => [...prev,wrongAnswer]);
                resetTimer();
                setCounter(prev => prev + 1);
            }
        }
    }

    const handleInput = (particle) => {
        if (particle === questionsArray[counter].particle)
        {
            resetTimer();
            setCounter(prev => prev + 1);
            setResultCount(prev => prev + 1);
        }
        else
        {
            let wrongAnswer = {
                particleG: questionsArray[counter].particle,
                particleW: particle,
                sentence: blurredSentence
            }
            setResultsArray(prev => [...prev,wrongAnswer]);
            resetTimer();
            setCounter(prev => prev + 1);
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

    const stopTimer = useCallback(() => {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }, []);

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
            setCounter(prev => prev + 1);
            handleInput(totalTime);
        };
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
        if(counter !== null && questionsArray.length > 0 && counter >= questionsArray.length){
            stopTimer();
            setMode("results");
        }
    }, [counter, questionsArray, stopTimer]);

    useEffect(() => {
        if(mode == null){
            stopTimer();
            setResultCount(0);
            setInputNumber(10);
            setResultsArray([]);
        }
    }, [mode])


    return (
        <div className="flex flex-col bg-amber-50 md:px-10 p-4 rounded-2xl w-full">
            {mode == null && (
                <div className="flex flex-col bg-gray-300 rounded-2xl p-5 items-center">
                    <p className="text-2xl font-black text-black text-center">Mode Selection</p>
                    <div className="flex flex-row w-full justify-evenly py-10">
                        {mode !== "easy" && (
                            <button onClick={() => setMode("easy")} className="px-5 py-2 rounded-md bg-green-400 font-black hover:bg-green-400/50">Easy</button>
                        )}
                        {mode !== "hard" && (
                            <button onClick={() => setMode("hard")} className="px-5 py-2 rounded-md bg-red-500 font-black hover:bg-red-500/50">Hard</button>
                        )}
                    </div>
                    <div className="flex justify-center items-center bg-white rounded-lg p-2">
                        <label className="text-sm text-black pr-1">No. Questions: </label>
                        <input onChange={handleNumberInput} min="0" type="number" placeholder="10" className="border-black text-center border-2 text-black rounded-lg"></input>
                    </div>
                </div>
            )}
            {mode === "easy" && (
                <div className="flex flex-col w-full">
                    <div className="flex flex-row text-black ">
                        <p className="text-md">{counter+1}. {translation}</p>
                        <p className="ml-auto font-bold">{(totalTime / 1000).toFixed(0)}</p>
                    </div>

                    <div className="w-full flex p-4 my-4 self-center items-center justify-center bg-gray-300 rounded-2xl border-2 border-black">
                        <p className="text-center text-black font-bold">{blurredSentence}</p>
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
                        <p className="text-md">{counter+1}. {translation}</p>
                        <p className="ml-auto font-bold">{(totalTime / 1000).toFixed(0)}</p>
                    </div>

                    <div className="w-full flex p-4 my-4 self-center items-center justify-center bg-gray-300 rounded-2xl border-2 border-black">
                        <p className="text-center text-black font-bold">{blurredSentence}</p>
                    </div>

                    <div className="flex items-center justify-center">
                        <input maxLength={3} autoCapitalize="none" autoCorrect="off" placeholder="入力" onChange={handleTextInput} onKeyDown={handleKeyDown} value={inputText} className="border-2 border-black align-middle text-center text-black w-24 pb-[env(safe-area-inset-bottom)]"></input>
                    </div>
                </div>
            )}
            {mode === "results" && (
                <div className="flex flex-col justify-center items-center">
                    <p className="text-2xl font-black text-black text-center">Results!</p>
                    <div className="flex flex-col text-black p-5 ">
                        <p className="text-md font-bold">Questions Answered: {resultCount} / {inputNumber}</p>
                        <p className="font-bold text-md">Wrong Answers: {inputNumber - resultCount}</p>
                        {resultsArray.length > 0 && (
                        <div className="flex flex-row m-4">
                            <GrCaretPrevious className="self-center" onClick={() => setResultsArrayInd((prev) => prev > 0 ? prev - 1 : 0)}/>
                            <div className="flex flex-col md:flex-row w-full max-w-md border border-black rounded-2xl p-3 gap-3">
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold text-center">Question {resultsArrayInd + 1}.</p>
                                    <p className="text-sm text-center">{resultsArray[resultsArrayInd]?.sentence}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold text-center">Your Answer</p>
                                    <p className="text-sm text-center">{resultsArray[resultsArrayInd]?.particleW === 0 ? "‎" : resultsArray[resultsArrayInd]?.particleW}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold text-center">Actual Answer</p>
                                    <p className="text-sm text-center">{resultsArray[resultsArrayInd]?.particleG}</p>
                                </div>
                            </div>
                            <GrCaretNext className="self-center" onClick={() => setResultsArrayInd((prev) => prev < resultsArray.length - 1 ? prev + 1 : 0)}/>
                        </div>
                    )}
                    </div>
                    <button className="bg-black hover:bg-black/90 text-white font-black p-5 rounded-2xl" onClick={() => setMode(null)}>Return Home</button>
                </div>
            )}
        </div>
    )
}

