"use client";
import Link from "next/link";
import CheckJapaneseLayoutComp from "./CheckJapaneseLayout";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Help() {
  const [index, setIndex] = useState(0);
  const pages = useMemo(
    () => [
      "Intro",
      "Kana Drill",
      "Sentence Structure",
      "Particle Practice",
      "Kanji Practice",
    ],
    [],
  );

  const changeIndex = useCallback(
    (direction) => {
      if (direction === "left") {
        setIndex((prev) => (prev - 1 + pages.length) % pages.length);
      }
      if (direction === "right") {
        setIndex((prev) => (prev + 1) % pages.length);
      }
    },
    [pages.length],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore shortcuts when typing inside an input or textarea
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "arrowleft":
          changeIndex("left");
          break;

        case "arrowright":
          changeIndex("right");
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [changeIndex]);
  return (
    <div className="flex flex-row w-full border-2 text-justify text-black">
      {index == 0 && (
        <ExplanationPage title={pages[index]}>
          <Paragraph
            subtitle={"What is it?"}
            text={
              "KantanKanji is a web application that was created to help beginner japanese learners to conceptualize and memorize the bases of the japanese language through various mini-games!"
            }
          />
          <Paragraph subtitle={"How will it help?"} text={""} />
        </ExplanationPage>
      )}
      {index == 1 && (
        <ExplanationPage title={pages[index]}>
          <Paragraph
            subtitle={"What is it?"}
            text={
              "In this mode you can memorize each kana from hiragana and katakana, alongside with their respective combinations."
            }
          />
        </ExplanationPage>
      )}
    </div>
  );
}

function ExplanationPage({ title, children }) {
  return (
    <div className="flex-1 px-2">
      <p className="text-3xl text-center m-2 font-black">{title}</p>
      {children}
    </div>
  );
}

function Paragraph({ subtitle, text }) {
  return (
    <div>
      <p className="text-left font-semibold text-xl m-2">{subtitle}</p>
      <p className="m-2">{text}</p>
    </div>
  );
}
