"use client"

import CheckJapaneseLayoutComp from "@/components/CheckJapaneseLayout";
import KanjiPracticeComp from "@/components/KanjiPractice";
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
        <h1 className="text-center p-1">Check your keyboard layout! <br></br> You will have to type in the reading of the kanji shown on screen.
        </h1>
        <CheckJapaneseLayoutComp/>
        <div className="mx-auto w-full p-4 md:p-5">
          <KanjiPracticeComp/>
        </div>

        <p className="font-bold text-center">How it works</p>
          <h1 className="text-center p-1">
            You can select the difficulty for the test, it can be either easy or hard. You will have 15 seconds to then input the correct reading of the kanji shown on screen.
            <p className="text-center">Note: You will need to use the japanese layout for this page.</p>
          </h1>
        <div className="flex flex-col my-4">
          <p className="font-bold mb-2">Easy mode</p>
          <p className="text-center">
              4 options will appear on the screen, you will have 15 seconds to select the correct answer.
          </p>
        </div>
        <div className="flex flex-col my-4">
          <p className="font-bold mb-2">Hard mode</p>
            <p className="text-center">
              You will have 15 seconds to type the correct answer directly, make sure to type the reading of the kanji itself.
            </p>
        </div>
      </div>
    </main>
  )
}