import KanaDrillComp from "@/components/KanaDrill";
import NavBarComp from "@/components/NavBar";
import Link from "next/link"

export default function HiraganaDrill() {

  return (
    <main className="flex items-center justify-center flex-col p-5">
      <NavBarComp/>
      <div className="md:w-1/2">
        <p className="text-center text-3xl p-4 font-black">Hiragana & Katakana Drill</p>
        <p className="text-center p-4">In this page you will be able to practice kana reading and writing.
          <br></br>Just select the type of kana you wish to memorize!
        </p>
        <p className="text-3xl font-bold p-4">Before You Begin</p>
        <p className="text-center p-1">If you are a beginner, please read this brief explanation about the
          <Link href="./alphabetExplanation/" target="_blank" className="underline text-[hsl(205,67%,62%)] ml-1">japanese alphabet.
          </Link>
        </p>
        <KanaDrillComp/>
        <h1 className="text-center p-1">
          <p className="font-bold">How it works</p>
          Just type the reading of the kana shown on screen in romaji, if you get it right another random kana will appear on screen.
        </h1>
        <p className="text-center p-1">Below you can select only hiragana or only katakana characters, if none is selected both will have a chance to appear.</p>
      </div>
    </main>
  );
}