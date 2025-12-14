"use client"

import CheckJapaneseLayoutComp from "@/components/CheckJapaneseLayout";
import NavBarComp from "@/components/NavBar";
import VerbPracticeComp from "@/components/VerbPractice";
import { useNavBar } from "@/utils/navBarProvider";

export default function VerbPractice(){
  const { boolClick } = useNavBar();

  return(
    <main className={`flex flex-col items-center p-5 min-h-dvh w-full ${boolClick ? "overflow-hidden" : "overflow-y-auto"}`}>
      <NavBarComp />
      <div className="md:w-1/2">
        <p className="text-center text-3xl p-4 font-black">Verb Practice</p>
        <p className="text-center p-4">In this page you will be able to practice the form of the verbs in japanese.
          <br></br>Verbs can be shown in a large amount of ways in Japanese, each way can change entirely what a sentence says, they are essential to understand the tense on a sentence, or even people&apos;s intentions.
          <br></br>This is the reason why having a basic knowledge about them is needed to understand the purpose of the following test. This page will only help you understand the time when each form is used, however it does not cover all of the forms that japanese has.
        </p>
        <p className="text-3xl font-bold p-4">Before You Begin</p>
        <h1 className="text-center p-1">Check your keyboard layout!
            <br></br> You will have to type in the reading of the missing attribute of the sentence shown on screen.
        </h1>
        <CheckJapaneseLayoutComp/>

        <div className="mx-auto w-full p-4 md:p-5">
          <VerbPracticeComp/>
        </div>

                <p className="font-bold text-center">How it works</p>
                <h1 className="text-center p-1">
                    You can select the difficulty for the test, it can be either easy or hard. 
                    <br></br>You are also able to change the amount of questions that will be shown, maximum amount can be up to 149 for the moment, and default is 10 questions. 
                    <br></br> You will have 15 seconds to then input the correct form of the verb needed on the sentence.
                    <p className="text-center">Note: You will need to use the japanese layout for this page.</p>
                </h1>
                <div className="flex flex-col my-4">
                    <p className="font-bold mb-2">Easy mode</p>
                    <p className="text-center">
                        4 options will appear on the screen, you will have to select the correct answer.
                    </p>
                </div>
                <div className="flex flex-col my-4">
                    <p className="font-bold mb-2">Hard mode</p>
                    <p className="text-center">
                        Type the correct answer directly, only hint is the translation of the sentence itself.
                    </p>
                </div>
            </div>
    </main>
  )
}