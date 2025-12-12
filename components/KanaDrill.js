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
        <div className="flex flex-col justify-center m-4">
            <div className="self-center">
                {currentKana ? <p className="text-5xl font-bold text-center pb-1">{currentKana.character}</p> : <p className="text-3xl font-bold text-center">‎</p> }
                <input placeholder="入力" onChange={handleInput} value={inputText} className="border-2 border-amber-50 align-middle text-center"></input>
            </div>
            <div className="flex flex-col m-4">
                <p className="text-center text-3xl font-bold m-4">Kana Selection</p>
                <div className="flex flex-row justify-evenly">
                    <button onClick={handleOnlyHiragana}>Only Hiragana</button>
                    <button onClick={handleOnlyKatakana}>Only Katakana</button>
                </div>
            </div>
        </div>
    )
}