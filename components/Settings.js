import { useMenuNavigation } from "@/app/hooks/useMenuNavigation";
import KanaDrill from "./KanaDrill/KanaDrill";
import PageLayout from "./PageLayout";
import { useKeyboard } from "@/app/context/KeyboardContext";
import { useNavigation } from "@/app/context/NavigationContext";
import { useCallback } from "react";

const OPTIONS = ["Kana Type", "Kana Row", "Kana Category"];
const BUTTONS = {
  "Kana Type": ["Hiragana", "Katakana"],
  "Kana Row": [
    "あ-row",
    "か-row",
    "さ-row",
    "た-row",
    "な-row",
    "は-row",
    "ま-row",
    "や-row",
    "ら-row",
    "わ-row",
  ],
  "Kana Category": ["Gojuon", "Dakuon", "Han-Dakuon", "Yoon"],
};

export default function Settings() {
  const { selected, moveSelection } = useMenuNavigation(BUTTONS.length);

  const { currentRoute } = useNavigation();

  const selectOption = useCallback(() => {}, []);

  const handleKeyboard = useCallback(
    (event) => {
      switch (event.key.toLowerCase()) {
        case "enter":
          selectOption(BUTTONS[selected]);
          break;

        case "arrowleft":
          moveSelection("left");
          break;

        case "arrowright":
          moveSelection("right");
          break;

        default:
          break;
      }
    },
    [selected, selectOption, moveSelection],
  );

  useKeyboard(handleKeyboard, currentRoute === "customDrill");
  return (
    <PageLayout title={"Customize Round"}>
      <div className="flex flex-col flex-1 items-center text-center gap-2 my-auto">
        {OPTIONS.map((option, id) => {
          const buttons = BUTTONS[option];
          return (
            <div key={id} className="bg-white w-full text-black">
              <p className="text-xl font-semibold">{option}</p>
              <div className="flex flex-wrap justify-center gap-2 p-2">
                {buttons?.map((button, index) => (
                  <div key={index} className={`"bg-amber-200" : "bg-white"}`}>
                    <button className={`p-2 border border-black`}>
                      {button}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div className="mt-auto">
          <button className="p-2 w-full bg-black text-center font-bold text-white">
            Start
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
