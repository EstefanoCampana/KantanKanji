"use client"
import CheckJapaneseLayoutComp from "@/components/CheckJapaneseLayout";
import NavBarComp from "@/components/NavBar";
import ParticlePracticeComp from "@/components/ParticlePractice";
import { useNavBar } from "@/utils/navBarProvider";


export default function Page() {
    const { boolClick } = useNavBar();

    return (
        <main className={`flex flex-col items-center p-5 min-h-dvh w-full ${boolClick ? "overflow-hidden" : "overflow-y-auto"}`}>
            <NavBarComp />
            <div className="flex-1 w-full md:w-1/2 overflow-y-auto overscroll-contain">
                <p className=" text-3xl font-black text-center p-4">Particle Practice</p>
                <p className="text-center">On this page you will be able to practice the usage of the different japanese particles.</p>
                <p className="text-3xl font-bold p-4">Before You Begin</p>
                <h1 className="text-center p-1">Check your keyboard layout! <br></br> You will have to type in the reading of the kana shown on screen.
                </h1>
                <CheckJapaneseLayoutComp/>
                <div className="mx-auto w-full p-4 md:p-5">
                    <ParticlePracticeComp />
                </div>
                <p className="font-bold text-center">How it works</p>
                <h1 className="text-center p-1">
                    You can select the difficulty for the test, it can be either easy or hard. You are also able to change the amount of questions that will be shown, maximum amount can be up to 149 for the moment. 
                    <br></br> You will have 15 seconds to then input the correct particle needed on the sentence.
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
