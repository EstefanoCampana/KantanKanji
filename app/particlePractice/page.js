"use client"
import NavBarComp from "@/components/NavBar";
import ParticlePracticeComp from "@/components/ParticlePractice";
import { useNavBar } from "@/utils/navBarProvider";
import { useEffect, useState } from "react";

export default function Page() {

    const [navBarStyle, setNavBarStyle] = useState("flex flex-col items-center p-5")
    const { boolClick } = useNavBar();

    useEffect(() => {
        if (boolClick == true) {
            setNavBarStyle("flex flex-col items-center p-5 h-screen overflow-hidden")
        }
        else {
            setNavBarStyle("flex flex-col items-center p-5")
        }
    }, [boolClick])
    return (
        <main className={navBarStyle}>
            <NavBarComp />
            <div className="md:w-1/2">
                <p className=" text-3xl font-black text-center p-4">Particle Practice</p>
                <p className="text-center">On this page you will be able to practice the usage of the different japanese particles.</p>
                <ParticlePracticeComp />
                <p className="font-bold text-center">How it works</p>
                <h1 className="text-center p-1">
                    After pressing start, you can select the difficulty for the test, it can be either easy or hard. You will have 15 seconds to then input the correct particle needed on the sentence.
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
