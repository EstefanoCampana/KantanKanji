"use client"
import NavBarComp from "@/components/NavBar";
import { useNavBar } from "@/utils/navBarProvider";
import Image from "next/image";


export default function Page() {
        const { boolClick } = useNavBar();
        return (
                <main className={`flex flex-col items-center p-5 min-h-dvh w-full ${boolClick ? "overflow-hidden" : "overflow-y-auto"}`}>
                        <NavBarComp />
                        <div className="md:w-1/2">
                                <p className="text-3xl font-black text-center p-4">Brief Explanation About Japanese Alphabet</p>
                                <p className="text-center">Let&apos;s start by stating the different alphabets that japanese uses, each one having its own purpose and context to be used.</p>
                                <p className="text-2xl font-bold my-4">Hiragana</p>
                                <h1 className="text-center">This is the name for the most important alphabet in japanese. It is a set of 46 characters, also known as <p className="underlined font-bold">kana.</p> There are 5 main vocals: あ (a)、い (i)、う (u)、え (e)、お (o). Each vocal will get its own letter across the alphabet as shown in the chart below.</h1>
                                <h1 className="text-center pb-4">They can also have 4 different forms, each of these will modify how a kana is read.</h1>
                                <p className="font-bold py-4">Gojuon</p>
                                <p className="text-center">It is the plain form of kanas.</p>
                                <p className="font-bold py-4">Dakuon</p>
                                <p className="text-center">This is represented by a symbol resembling the double-quotation mark, it changes the sound of gojuon to:</p>
                                <ul className="flex flex-row justify-evenly my-4">
                                        <li>か (ka) -&gt; が (ga)</li>
                                        <li>さ (sa) -&gt; ざ (za)</li>
                                        <li>た (ta) -&gt; だ (da)</li>
                                        <li>は (ha) -&gt; ば (ba)</li>
                                </ul>
                                <p className="text-center">This form of the kana has some exceptions, such as:</p>
                                <ul className="flex flex-row justify-center md:justify-evenly my-4">
                                        <li>し (shi) -&gt; じ (ji)　</li>
                                        <li>ち (chi) -&gt; ぢ (ji)　</li>
                                        <li>つ (tsu) -&gt; づ (zu)　</li>
                                </ul>
                                <p className="font-bold py-4">Han-Dakuon</p>
                                <p className="text-center">This is represented by a little circle, it changes the sound of the row of は to:</p>
                                <ul className="flex flex-row justify-evenly my-4">
                                        <li>は (ha) -&gt; ぱ (pa)</li>
                                </ul>
                                <Image src="/hiraganaChart.png" alt="hiragana chart" width={800} height={500}></Image>
                                <p className="text-2xl font-bold my-4">Katakana</p>
                                <p className="text-center mb-4">This alphabet is used to refer to words that are not originated from japanese. This means that you can use this alphabet to introduce your name in japanese, or use it to reference an object with a name internationally known, such as: インターネット (intaanetto).<br></br>The pronunciation of these characters are the same as their hiragana version, and same rules for gojuon, dakuon, han-dakuon, yoon, and sokuon are implemented.</p>
                                <Image src="/katakanaChart.png" alt="hiragana chart" width={800} height={500}></Image>
                        </div>
                </main>
        )
}