"use client"
import CheckJapaneseLayoutComp from "@/components/CheckJapaneseLayout";
import NavBarComp from "@/components/NavBar";
import { useNavBar } from "@/utils/navBarProvider";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [navBarStyle, setNavBarStyle] = useState("flex flex-col items-center p-5");
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
        <p className="text-center text-3xl p-4 font-black">Welcome to KantanKanji</p>
        <p className="text-center p-4">KantanKanji is a web application that will help current japanese learners to enhance their knowledge on basic sentence structure.</p>
        <p className="text-center p-4">This web application assumes you already know some words and basic grammar structure. This web app will only help you strengthen your knowledge in basic japanese, however it also encourages you to learn words and grammar outside of it.</p>
        <p className="text-3xl font-bold p-4">For Beginners</p>
        <p className="text-center p-4">If you somehow found this application and you are still unsure where to start. You can start learning how to read and write hiragana and katakana (the japanese alphabet) in the <Link href="./hiraganaDrill" target="_blank" className="text-[hsl(205,67%,62%)] underline">Hiragana Drill</Link> tab.</p>
        <p className="text-center p-4">You can also try learning basic words with the <Link href="https://apps.ankiweb.net/" target="_blank" className="text-[hsl(205,67%,62%)] underline">Anki</Link> app and the <Link href="https://drive.google.com/file/d/1mHXSGeb-bh6I7VhktIiyESQIxpVO-EwN/view" target="_blank" className="text-[hsl(205,67%,62%)] underline">6k core words deck</Link>. This is recommended as many words from this deck will appear further into the app. </p>
        <p className="text-3xl font-bold p-4">Before You Begin</p>
        <p className="text-center">This app depends on its entirety on the japanese keyboard layout for both desktop or mobile, make sure you have it installed in your device before proceeding.</p>
        <CheckJapaneseLayoutComp />
        <p className="text-center p-4">If you are unsure on how to change your keyboard settings, you can check it in the following links:</p>
        <div className="flex flex-row justify-evenly">
          <Link className="underline" href="https://www.youtube.com/watch?v=g3xmRCrbLVU" target="_blank">For Windows</Link>
          <Link className="underline" href="https://www.youtube.com/watch?v=V4eqENDFdJ4" target="_blank">For Android</Link>
          <Link className="underline" href="https://www.youtube.com/watch?v=1R-52b7Ugg8" target="_blank">For IOS</Link>
        </div>
      </div>
    </main>
  );
}
