import { useLanguage } from "@/app/context/LanguageContext";
import Furigana from "./Furigana";

export function Title({ text }) {
  const { kanji, isJp, isHydrated } = useLanguage();
  const regex = new RegExp("[一-龠]+|[々〆〤ヶ]", "u");
  const kana = text.match(regex)[0];
  const kanjiToRender = [];

  let char = kana[0];
  while (isHydrated) {
    for (let i = 0; i < kana.length; i++) {
      if (kanji.find((chara) => chara.character === char)) {
        kanjiToRender.push({
          reading:
            kanji[kanji.findIndex((chara) => chara.character === char)].reading,
          character:
            kanji[kanji.findIndex((chara) => chara.character === char)]
              .character,
        });
        char = kana[i + 1];
      } else {
        char += kana[i + 1];
      }
    }
    break;
  }

  return (
    <>
      {isJp &&
        kanjiToRender.map((kanji, id) => {
          return (
            <Furigana
              key={id}
              kana={kanji?.character}
              reading={kanji?.reading}
            />
          );
        })}
      <p className="text-4xl text-black">
        {isJp ? text.split(regex)[1] : text.slice(0, text.match(regex).index)}
        &nbsp;
      </p>
      {!isJp &&
        kanjiToRender.map((kanji, id) => {
          return (
            <Furigana
              key={id}
              kana={kanji?.character}
              reading={kanji?.reading}
            />
          );
        })}
    </>
  );
}
