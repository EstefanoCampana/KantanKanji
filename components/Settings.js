import { useMenuNavigation } from "@/app/hooks/useMenuNavigation";
import KanaDrill from "./KanaDrill/KanaDrill";
import PageLayout from "./PageLayout";
import { useKeyboard } from "@/app/context/KeyboardContext";
import { useNavigation } from "@/app/context/NavigationContext";
import { useCallback } from "react";
import { useSettings } from "@/app/context/SettingsContext";

const OPTIONS = [
  {
    label: "Kana Type",
    setting: "kanaType",
    values: [
      { label: "Hiragana", value: "hiragana" },
      { label: "Katakana", value: "katakana" },
    ],
  },
  {
    label: "Kana Row",
    setting: "kanaRow",
    values: [
      { label: "あ-row", value: "あ-row" },
      { label: "か-row", value: "か-row" },
      { label: "さ-row", value: "さ-row" },
      { label: "た-row", value: "た-row" },
      { label: "な-row", value: "な-row" },
      { label: "は-row", value: "は-row" },
      { label: "ま-row", value: "ま-row" },
      { label: "や-row", value: "や-row" },
      { label: "ら-row", value: "ら-row" },
      { label: "わ-row", value: "わ-row" },
    ],
  },
  {
    label: "Kana Category",
    setting: "kanaCategory",
    values: [
      { label: "Gojuon", value: "gojuon" },
      { label: "Dakuon", value: "dakuon" },
      { label: "Han-Dakuon", value: "han-dakuon" },
      { label: "Yoon", value: "yoon" },
    ],
  },
];

export default function Settings() {
  const { selected, moveSelection } = useMenuNavigation(OPTIONS.length);

  const currentOption = OPTIONS[selected];

  const {
    selected: selectedButton,
    setSelected: setSelectedButton,
    moveSelection: moveButtonSelection,
  } = useMenuNavigation(currentOption.values.length);

  const { currentRoute } = useNavigation();

  const { settings, updateDrillSetting, isHydrated } = useSettings();

  const moveSection = useCallback(
    (direction) => {
      moveSelection(direction);
      setSelectedButton(0);
    },
    [moveSelection, setSelectedButton],
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
          updateDrillSetting(
            currentOption.setting,
            currentOption.values[selectedButton].value,
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
      updateDrillSetting,
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
              selected === id ? "bg-amber-100" : "bg-white"
            } text-black`}
          >
            <p className="text-xl font-semibold">{option.label}</p>
            <div className="flex flex-wrap justify-center gap-2 p-2">
              {option.values.map((button, index) => {
                const isSelected =
                  settings.customDrill[option.setting] === button.value;

                const isFocused = selected === id && selectedButton === index;
                return (
                  <button
                    key={button.value}
                    type="button"
                    onClick={() =>
                      updateDrillSetting(option.setting, button.value)
                    }
                    className={`p-2 border border-black ${
                      isSelected ? "bg-amber-400 font-bold" : "bg-white"
                    } ${isFocused ? "ring-4 ring-blue-500" : ""}`}
                  >
                    {button.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="mt-auto">
          <button className="p-2 w-full bg-black text-center font-bold text-white">
            Start
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
