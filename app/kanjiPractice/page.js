"use client"

import CheckJapaneseLayoutComp from "@/components/CheckJapaneseLayout";
import NavBarComp from "@/components/NavBar";
import { useNavBar } from "@/utils/navBarProvider";

export default function KanjiPractice(){
  const { boolClick } = useNavBar();

  return(
    <main className={`flex flex-col items-center p-5 min-h-dvh w-full ${boolClick ? "overflow-hidden" : "overflow-y-auto"}`}>
      <NavBarComp />
      <div className="md:w-1/2">
        <p className="text-center text-3xl p-4 font-black">Kanji Practice</p>
        <p className="text-center p-4">In this page you will be able to practice kanji reading and writing.
          <br></br>Kanji (漢字) is the most fundamental linguistic structure in japanese, since these are the representations of words themselves.
        </p>
        <p className="text-3xl font-bold p-4">Before You Begin</p>
        <h1 className="text-center p-1">Check your keyboard layout! You will have to type in the reading of the kanji shown on screen.
        </h1>
        <CheckJapaneseLayoutComp/>
        <h1 className="text-center p-1">
          <p className="font-bold">How it works</p>
          Just type the reading of the kana shown on screen in romaji, if you get it right another random kana will appear on screen.
        </h1>
        <p className="text-center p-1">Below you can select only hiragana or only katakana characters, if none is selected both will have a chance to appear.</p>
      </div>
    </main>
  )
}