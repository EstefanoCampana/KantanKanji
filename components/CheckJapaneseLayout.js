"use client"
import {useState} from "react";

export default function CheckJapaneseLayoutComp(){
    let hiragana = false
    const [jpText, setJpText] = useState("");
    const handleText = (event) => {setJpText(event.target.value)}
  const regex = new RegExp("[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[々〆〤ヶ]","u")
    if(regex.test(jpText)){
        hiragana = true
    }
    else{
        hiragana = false
    }

    return(
        <div className="flex justify-center flex-col m-4">
            <p className="text-3xl text-center p-2">Test your layout here!</p>
            <input placeholder="Enter Text Here" onChange={handleText} value={jpText} className="border-2 border-amber-50 align-middle text-center"></input>
            {hiragana == true ? <p className="text-[#658C58] ">Text is japanese</p> : <p className="text-[#BF092F] ">Text is not japanese</p>}
        </div>

    )
}