import { useMenuNavigation } from "@/app/hooks/useMenuNavigation";
import KanaDrill from "./KanaDrill/KanaDrill";
import PageLayout from "./PageLayout";
import { useKeyboard } from "@/app/context/KeyboardContext";
import { useNavigation } from "@/app/context/NavigationContext";
import { useCallback } from "react";
import { useSettings } from "@/app/context/SettingsContext";
import { useMediaQuery } from "./UseMediaQuery";
import Settings from "./Settings";

const OPTIONS = [
  {
    label: "Language",
    setting: "language",
    values: [
      { label: "English", value: "english" },
      { label: "Japanese", value: "japanese" },
    ],
  },
  {
    label: "Gameplay",
    setting: "gameplay",
    values: [
      { label: "Furigana", value: "furigana" },
      { label: "Input", value: "input" },
    ],
  },
  {
    label: "Gameplay",
    setting: "gameplay2",
    values: [
      { label: "Furigana", value: "furigana" },
      { label: "Input", value: "input" },
    ],
  },
  {
    label: "Gameplay",
    setting: "gameplay3",
    values: [
      { label: "Furigana", value: "furigana" },
      { label: "Input", value: "input" },
    ],
  },
  {
    label: "Gameplay",
    setting: "gameplay4",
    values: [
      { label: "Furigana", value: "furigana" },
      { label: "Input", value: "input" },
    ],
  },
  {
    label: "Gameplay",
    setting: "gameplay5",
    values: [
      { label: "Furigana", value: "furigana" },
      { label: "Input", value: "input" },
    ],
  },
];

export default function GeneralSettings() {
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

  const { settings, updateGeneralSetting, isHydrated } = useSettings();

  const small = useMediaQuery("(max-width: 768px)");

  const moveSection = useCallback(
    (direction) => {
      moveSelection(direction);
      setSelectedButton(0);
    },
    [moveSelection, setSelectedButton],
  );

  const handleButtonAction = useCallback(
    (option, button) => {
      switch (button.value) {
        default:
          updateGeneralSetting(option.setting, button.value);
          break;
      }
    },
    [updateGeneralSetting],
  );

  const buttonActions = (id, index, option, button) => {
    setSelected(id);
    setSelectedButton(index);
    handleButtonAction(option, button);
  };

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

  useKeyboard(handleKeyboard, currentRoute === "settings");

  if (!isHydrated) return null;

  return (
    <Settings
      options={OPTIONS}
      source="general"
      settings={settings}
      selectedSection={selected}
      selectedButton={selectedButton}
      small={small}
      buttonActions={buttonActions}
    />
  );
}
