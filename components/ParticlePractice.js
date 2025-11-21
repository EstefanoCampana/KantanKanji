"use client"
import { useMemo, useState, useEffect, useRef, useCallback } from "react"
import grammar from "../dataFiles/grammar.json"
import { TimerOff } from "lucide";

export default function ParticlePracticeComp(){
    const INITIAL_TIME = 15*1000;
    const [mode, setMode] = useState(null);
    const [randomIndex, setRandomIndex] = useState(null);
    const [grammarArray, setGrammarArray] = useState(grammar)
    const [particleArray, setParticleArray] = useState(
        ["は","が","で","に","を","の","も","と","へ"])
    const [counter, setCounter] = useState(1);
    const [totalTime, setTotalTime] = useState(INITIAL_TIME); 
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const [inputText, setInputText] = useState("");

    const handleTextInput = (event) => {setInputText(event.target.value)};
    const handleKeyDown = (event) => {
        if(event.key === "Enter")
        {    
            if(inputText === grammarArray[randomIndex].particle)
            {
                getNewRandomIndex();
                resetTimer();
                setInputText("");
                setCounter(counter+1);
            }
        }
    }

    const getNewRandomIndex = () => 
    {
        let newIndex = Math.floor(Math.random() * grammarArray.length);
        if(newIndex == randomIndex){
            while(true)
            {
                newIndex = Math.floor(Math.random() * grammarArray.length);
                if(newIndex != randomIndex){
                    break;
                }
            }

        }
        setRandomIndex(newIndex);
    }

    const handleInput = (particle) => {
        if(particle === grammarArray[randomIndex].particle){
            getNewRandomIndex();
            resetTimer();
        }
        setCounter(counter+1);
    }

    const startTimer = useCallback(() =>{
        clearInterval(timerRef.current);
        startTimeRef.current = Date.now();

        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = INITIAL_TIME - elapsed;
            
            setTotalTime(prev => remaining <= 0 ? 0 : remaining);

            if(remaining <= 0) {
                clearInterval(timerRef.current);
            }
        }, 10);
    }, [])

    const resetTimer = useCallback(() => {
        setTotalTime(INITIAL_TIME);
        startTimer();
    }, [startTimer, INITIAL_TIME])

    useEffect(() => {
        getNewRandomIndex();
    }, []);

    useEffect(() => {
        if(mode == null) return;
        resetTimer();
        return () => clearInterval(timerRef.current);
    }, [mode, resetTimer]);

    const answersArray = useMemo(() => {
        if(randomIndex == null) return;
        let filtered = [...particleArray.filter((particle) => particle === grammarArray[randomIndex].particle),...particleArray.sort(() => Math.random() - 0.5).slice(0,3)]
        if(filtered.filter((particle) => particle === grammarArray[randomIndex].particle).length >= 2)
            {
                while(true)
                {
                    filtered = [...particleArray.filter((particle) => particle === grammarArray[randomIndex].particle),...particleArray.sort(() => Math.random() - 0.5).slice(0,3)]
                    if(filtered.filter((particle) => particle === grammarArray[randomIndex].particle).length == 1){
                        break;
                    }
                }
            }
        return filtered.sort(() => Math.random() -0.5)
    }, [particleArray, grammarArray, randomIndex])

    const currentSentence = randomIndex !== null ? grammarArray[randomIndex].sentence : null;
    const currentTranslation = randomIndex !== null ? grammarArray[randomIndex].translation : null;
    return(
        <div className="flex flex-col bg-amber-50 my-4 md:px-10 p-6 h-50 justify-center">
            {mode == null && (
                <div className="flex flex-row justify-evenly">
                    {mode !== "easy" && (
                        <button onClick={() => setMode("easy")} className="px-5 py-2 rounded-md bg-green-400 font-black hover:bg-green-400/50">Easy</button>
                    )}
                    {mode !== "hard" && (
                        <button onClick={() => setMode("hard")} className="px-5 py-2 rounded-md bg-red-500 font-black hover:bg-red-500/50">Hard</button>
                    )}
                </div>      
            )}
            {mode === "easy" && (
                <div className="flex flex-bold w-full">
                    <div className="flex flex-row text-black font-bold self-center text-center">
                        <p className="text-center self-center text-md">{counter}. {currentTranslation}</p>
                        <p className="">{(totalTime / 1000).toFixed(0)}</p>
                    </div>

                    <div className="flex mx-4 w-75 h-15 self-center items-center justify-center">
                        <p className="text-center text-black">{currentSentence}</p>
                    </div>
                            
                    <div className="grid grid-flow-dense grid-rows-2 grid-cols-2 gap-2">
                        {answersArray.map((particle, id) => (
                            <button value={particle} onClick={() => handleInput(particle)} className="py-1 rounded-md bg-red-500 border-gray-200 border-2 hover:bg-red-500/50" key={id}>{particle}</button>
                        ))}
                    </div>
                </div>
            )}
            {mode === "hard" && (
                <div className="flex flex-col w-full">
                    <div className="flex flex-row text-black font-bold">
                        <p className="self-start text-md">{counter}. {currentTranslation}</p>
                        <p className="ml-auto">{(totalTime / 1000).toFixed(0)}</p>
                    </div>

                    <div className="flex mx-4 w-75 h-15 self-center items-center justify-center">
                        <p className="text-center text-black">{currentSentence}</p>
                    </div>
                            
                    <div className="flex items-center justify-center">
                        <input placeholder="入力" onChange={handleTextInput} onKeyDown={handleKeyDown} value={inputText} className="border-2 border-black align-middle text-center text-black"></input>
                    </div>
                </div>
            )}
       
        </div>
    )
}

