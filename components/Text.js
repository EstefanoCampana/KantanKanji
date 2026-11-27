import { useLanguage } from "@/app/context/LanguageContext";
import Furigana from "./Furigana";

export function Title({ text }) {
  const { kanji, isJp } = useLanguage();
  const regex = new RegExp("[一-龠]+|[々〆〤ヶ]", "g");
  const kana = text.match(regex)[0];
  console.log(Array.from(text.matchAll(regex)));
  return (
    <>
      {isJp && (
        <Furigana
          kana={kana}
          reading={kanji
            .filter((kanji) => kanji?.character === kana)
            .map((kanji) => kanji?.reading)}
        />
      )}
      <p className="text-4xl text-black">
        {isJp ? text.split(regex)[1] : text.slice(0, text.match(regex).index)}
      </p>
      {!isJp && <Furigana kana={kana} />}
    </>
  );
}
