"use client"
import CheckJapaneseLayoutComp from "@/components/CheckJapaneseLayout";
import Image from "next/image";


export default function Home() {

  return (
    <main className="flex items-center justify-center flex-col p-5">
      <section>
        <p className="text-center text-3xl">Hello and Welcome to KantanKanji</p>
        <p className="text-center">KantanKanji is a web application that will help current japanese learners to enhance their knowledge on basic sentence structure.</p>
        <p className="text-3xl font-bold">Before You Begin</p>
        <p className="text-center">This app depends on its entirety on the japanese keyboard layout for both desktop or mobile, make sure you have it installed in your device before proceeding.</p>
        <CheckJapaneseLayoutComp/>
      </section>
    </main>
  );
}
