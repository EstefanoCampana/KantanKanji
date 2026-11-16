import { useMenuNavigation } from "@/app/hooks/useMenuNavigation";
import KanaDrill from "./KanaDrill/KanaDrill";
import PageLayout from "./PageLayout";
import { useKeyboard } from "@/app/context/KeyboardContext";
import { useNavigation } from "@/app/context/NavigationContext";
import { useCallback } from "react";
import { useSettings } from "@/app/context/SettingsContext";

const OPTIONS = [
  {
    label: "",
    setting: "quick",
    values: [
      { label: "Select All", value: "selectAll" },
      { label: "Deselect All", value: "deselectAll" },
    ],
  },
  {
    label: "Kana Type",
    setting: "kanaTypes",
    values: [
      { label: "Hiragana", value: "hiragana" },
      { label: "Katakana", value: "katakana" },
    ],
  },
  {
    label: "Kana Row",
    setting: "kanaRows",
    values: [
      { label: "あ-row", value: "arow" },
      { label: "か-row", value: "karow" },
      { label: "さ-row", value: "sarow" },
      { label: "た-row", value: "tarow" },
      { label: "な-row", value: "narow" },
      { label: "は-row", value: "harow" },
      { label: "ま-row", value: "marow" },
      { label: "や-row", value: "yarow" },
      { label: "ら-row", value: "rarow" },
      { label: "わ-row", value: "warow" },
    ],
  },
  {
    label: "Kana Category",
    setting: "kanaCategories",
    values: [
      { label: "Gojuon", value: "gojuon" },
      { label: "Dakuon", value: "dakuon" },
      { label: "Han Dakuon", value: "handakuon" },
      { label: "Yoon", value: "yoon" },
    ],
  },
  {
    label: "",
    setting: "start",
    values: [{ label: "Start", value: "start" }],
  },
];

const CATEGORY_ROWS = {
  gojuon: [
    "arow",
    "karow",
    "sarow",
    "tarow",
    "narow",
    "harow",
    "marow",
    "yarow",
    "rarow",
    "warow",
  ],
  dakuon: ["karow", "sarow", "tarow", "harow"],
  handakuon: ["harow"],
  yoon: ["karow", "sarow", "tarow", "narow", "harow", "marow", "rarow"],
};

function getAvailableRows(selectedCategories) {
  const availableRows = new Set();

  selectedCategories.forEach((category) => {
    CATEGORY_ROWS[category]?.forEach((row) => {
      availableRows.add(row);
    });
  });

  return availableRows;
}

export default function Settings() {
  const { selected, setSelected, moveSelection } = useMenuNavigation(
    OPTIONS.length,
  );

  const currentOption = OPTIONS[selected];

  const {
    selected: selectedButton,
    setSelected: setSelectedButton,
    moveSelection: moveButtonSelection,
  } = useMenuNavigation(currentOption.values.length);

  const { currentRoute, navigate } = useNavigation();

  const { settings, toggleDrillSetting, updateDrillSettings, isHydrated } =
    useSettings();

  const availableRows = getAvailableRows(settings.customDrill.kanaCategories);

  const moveSection = useCallback(
    (direction) => {
      moveSelection(direction);
      setSelectedButton(0);
    },
    [moveSelection, setSelectedButton],
  );

  const selectAllSettings = useCallback(() => {
    updateDrillSettings({
      kanaTypes: ["hiragana", "katakana"],
      kanaRows: [
        "arow",
        "karow",
        "sarow",
        "tarow",
        "narow",
        "harow",
        "marow",
        "yarow",
        "rarow",
        "warow",
      ],
      kanaCategories: ["gojuon", "dakuon", "handakuon", "yoon"],
    });
  }, [updateDrillSettings]);

  const deselectAllSettings = useCallback(() => {
    updateDrillSettings({
      kanaTypes: ["hiragana"],
      kanaRows: ["arow"],
      kanaCategories: ["gojuon"],
    });
  }, [updateDrillSettings]);

  const startDrill = useCallback(() => {
    navigate("customDrillGame");
  }, [navigate]);

  const handleButtonAction = useCallback(
    (option, button) => {
      switch (button.value) {
        case "selectAll":
          selectAllSettings();
          break;
        case "deselectAll":
          deselectAllSettings();
          break;
        case "start":
          startDrill();
          break;
        default:
          toggleDrillSetting(option.setting, button.value);
          break;
      }
    },
    [toggleDrillSetting, selectAllSettings, deselectAllSettings, startDrill],
  );

  const handleKeyboard = useCallback(
    (event) => {
      switch (event.key.toLowerCase()) {
        case "arrowleft":
          moveButtonSelection("left");
          break;

        case "arrowright":
          moveButtonSelection("right");
          break;

        case "arrowup":
          moveSection("up");
          break;

        case "arrowdown":
          moveSection("down");
          break;

        case "enter":
          handleButtonAction(
            currentOption,
            currentOption.values[selectedButton],
          );
          break;

        default:
          break;
      }
    },
    [
      currentOption,
      selectedButton,
      moveButtonSelection,
      handleButtonAction,
      moveSection,
    ],
  );

  useKeyboard(handleKeyboard, currentRoute === "customDrill");

  if (!isHydrated) return null;

  return (
    <PageLayout title={"Customize Round"}>
      <div className="flex flex-col flex-1 items-center text-center gap-2 my-auto">
        {OPTIONS.map((option, id) => (
          <div
            key={option.setting}
            className={`w-full ${
              selected === id
                ? "bg-amber-100 ring ring-black"
                : "bg-transparent"
            } text-black`}
          >
            <p className="text-xl font-semibold">{option.label}</p>
            <div className="flex flex-wrap justify-center gap-2 p-2">
              {(option.setting === "kanaRows"
                ? option.values.filter((button) =>
                    availableRows.has(button.value),
                  )
                : option.values
              ).map((button, index) => {
                const isSelected = settings.customDrill[
                  option.setting
                ]?.includes(button.value);

                const isFocused = selected === id && selectedButton === index;
                const start = button.value === "start";
                return (
                  <button
                    key={button.value}
                    type="button"
                    onClick={() => {
                      setSelected(id);
                      setSelectedButton(index);
                      handleButtonAction(option, button);
                    }}
                    className={`p-2 border border-black ${start ? "bg-black text-white" : isSelected ? "bg-amber-400 font-bold" : "bg-white text-black"}
                    ${isFocused ? "ring-4 ring-blue-500" : ""}`}
                  >
                    {button.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
