// Fisher-Yates shuffle
export function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds % 1000)}`;
}

export function filterKana(data, settings) {
  const TYPE_PREFIX = {
    hiragana: "hira",
    katakana: "kata",
  };

  const CATEGORY_TAGS = {
    gojuon: ["hirago", "katago"],
    dakuon: ["hirada", "katada"],
    handakuon: ["hiraha", "kataha"],
    yoon: ["hirayo", "katayo"],
  };

  const { kanaTypes, kanaRows, kanaCategories } = settings;

  return data.filter((kana) => {
    const category = kana.category ?? "";

    // OR: Match any selected kana type
    const matchesType = kanaTypes.some((type) => {
      const prefix = TYPE_PREFIX[type];
      return prefix && category.startsWith(prefix);
    });

    // OR: Match any selected row
    const matchesRow = kanaRows.includes(kana.row);

    // OR: Match any selected kana category
    const matchesCategory = kanaCategories.some((selectedCategory) =>
      CATEGORY_TAGS[selectedCategory]?.includes(category),
    );

    // AND: All three groups must match
    return matchesType && matchesRow && matchesCategory;
  });
}
