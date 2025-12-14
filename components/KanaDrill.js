"use client"

import { getKana } from "@/app/services/kantankanji-services";
import { useState, useEffect, useMemo } from "react";

export default function KanaDrillComp(){

    const [inputText, setInputText] = useState("");
    const [randomIndex, setRandomIndex] = useState(null);
    const [onlyHiragana, setOnlyHiragana] = useState(false);
    const [onlyKatakana, setOnlyKatakana] = useState(false);
    const [fullKana, setFullKana] = useState([]);

    const kanaArray = useMemo(() =>{
        let filtered = [...fullKana]
        if (onlyHiragana){
            return filtered.filter((kana) => kana.category.startsWith("hira"));
        }
        if (onlyKatakana){
            return filtered.filter((kana) => kana.category.startsWith("kata"));
        }
        return filtered;
    }, [onlyHiragana, onlyKatakana, fullKana])
    
    const getNewRandomIndex = () => 
        {
            if (kanaArray.length === 0 ) return;
            const newIndex = Math.floor(Math.random() * kanaArray.length);
            setRandomIndex(newIndex);
        }
    const handleInput = (event) => {setInputText(event.target.value.toLowerCase())};
    
    const handleOnlyKatakana = () => {
        setOnlyKatakana(prev => !prev);
        setOnlyHiragana(false);
    };
    
    const handleOnlyHiragana = () => {
        setOnlyHiragana(prev => !prev);
        setOnlyKatakana(false);
    };

    useEffect(() => {
        getNewRandomIndex();
        getKana(setFullKana);
    }, []);

    useEffect(() => {
        getNewRandomIndex();
    }, [kanaArray]);

    useEffect(() => {
        if (!inputText || randomIndex === null) return;

        const actual = kanaArray[randomIndex];
        if (!actual) return;

        if(inputText === kanaArray[randomIndex].reading){
            getNewRandomIndex();
            setInputText("");
        }
    }, [inputText]);

    const currentKana = randomIndex !== null ? kanaArray[randomIndex] : null;
    return(
        <div className="flex flex-col bg-amber-50 md:px-10 p-4 rounded-2xl w-full">
            <div className="flex flex-col bg-gray-300 rounded-2xl p-5 items-center">
                <div className="flex-col w-full flex p-4 my-4 self-center items-center justify-center bg-white border-2 rounded-2xl border-black">
                    <p className="text-5xl text-center text-black font-bold pb-2">{currentKana?.character}</p>
                    <input placeholder="入力" onChange={handleInput} maxLength={3} value={inputText} className="border-2 border-black text-black rounded-lg align-middle text-center bg-gray-300"></input>
                </div>
                <p className="text-2xl font-black text-black text-center">Kana Selection</p>
                    <div className="flex flex-row w-full justify-evenly py-2">
                            <button onClick={handleOnlyHiragana} className={!onlyHiragana ? `px-5 py-2 rounded-md bg-red-500 font-black hover:bg-red-500/50`:`px-5 py-2 rounded-md bg-green-400 font-black hover:bg-green-400/50`}>Hiragana</button>
                            <button onClick={handleOnlyKatakana} className={!onlyKatakana ? `px-5 py-2 rounded-md bg-red-500 font-black hover:bg-red-500/50`: `px-5 py-2 rounded-md bg-green-400 font-black hover:bg-green-400/50`}>Katakana</button>
                    </div>
                </div>
        </div>
    )
}