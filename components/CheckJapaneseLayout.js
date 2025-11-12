"use client"
import {useState} from "react";

export default function CheckJapaneseLayoutComp(){
    let hiragana = "text-center"
    const [jpText, setJpText] = useState("");
    const handleText = (event) => {setJpText(event.target.value)}
  const regex = new RegExp("[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[々〆〤ヶ]","u")
    if(regex.test(jpText)){
        hiragana = "text-[#658C58] text-center"
    }
    else{
        hiragana = "text-[#BF092F] text-center"
    }

    return(
        <div className="flex justify-center flex-col">
            <input onChange={handleText} value={jpText} className="border-2 border-amber-50 align-middle"></input>
            <p className={hiragana}>Text is hiragana</p>
        </div>

    )
}