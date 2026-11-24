import PageLayout from "./PageLayout";

export default function Settings({
  options,
  source,
  settings,
  availableRows = null,
  selectedSection,
  selectedButton,
  small,
  buttonActions,
}) {
  const VISIBLE_COUNT = 5;

  const visibleStart = Math.min(
    Math.max(selectedSection - VISIBLE_COUNT + 1, 0),
    options.length - VISIBLE_COUNT,
  );

  const visibleOptions = options.slice(
    visibleStart,
    visibleStart + VISIBLE_COUNT,
  );

  const checkSettingsSource = (source, settings, option, button) => {
    if (source === "general") {
      return settings.general[option.setting]?.includes(button.value);
    }
    if (source === "customDrill") {
      return settings.customDrill[option.setting]?.includes(button.value);
    }
  };

  return (
    <PageLayout title={"Settings"}>
      <div className="flex flex-col flex-1 items-center text-center gap-2 overflow-y-hidden">
        {visibleOptions.map((option, index) => {
          const id = visibleStart + index;

          return (
            <div
              key={option.setting}
              className={`flex flex-col flex-1 w-full h-full ${
                selectedSection === id
                  ? "bg-amber-100 ring ring-black"
                  : "bg-transparent"
              } text-black`}
            >
              <p className="text-xl font-semibold">{option.label}</p>
              <div
                className={`${small ? "grid grid-cols-2" : "flex flex-row"} h-full items-center gap-2 p-2`}
              >
                {option.values.map((button, index) => {
                  const isSelected = checkSettingsSource(
                    source,
                    settings,
                    option,
                    button,
                  );

                  const isFocused =
                    selectedSection === id && selectedButton === index;
                  const start = button.value === "start";
                  return (
                    <button
                      key={button.value}
                      type="button"
                      onClick={() => {
                        buttonActions(id, index, option, button);
                      }}
                      className={`p-2 border border-black h-full w-full  ${start ? "col-span-2 bg-black text-white" : isSelected ? "bg-amber-400 font-bold" : "bg-white text-black"}
                    ${isFocused ? "ring-4 ring-blue-500" : ""}`}
                    >
                      {button.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
