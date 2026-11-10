export default function Question({
  index,
  time,
  question,
  questionSize = "xl",
  input = false,
  inputHandler,
  inputText,
  answerArray = [],
  optionSelected = 0,
  back,
}) {
  return (
    <div className="flex flex-1 w-full flex-col items-center bg-white border-2 rounded-2xl border-black">
      <div className="text-black flex flex-row gap-2 items-center my-auto">
        <p className="border-2 border-black rounded-xl px-2">{index}</p>
        <p className="border-2 border-amber-50/0">{time}</p>
      </div>
      <div className=" flex-col my-auto">
        <div className="">
          <p
            className={`text-[${questionSize}] border-b-4 text-center text-black font-bold mb-4`}
          >
            {question}
          </p>
        </div>
        <div className="flex flex-row gap-4 justify-center">
          {input ? (
            <input
              placeholder="入力"
              onChange={inputHandler}
              maxLength={3}
              value={inputText}
              className="border-2 w-full border-black text-black rounded-lg text-center bg-gray-300"
              autoFocus
            ></input>
          ) : (
            answerArray.map((answer, id) => (
              <div
                key={id}
                className={`text-black text-xl border border-black ${optionSelected === id ? "bg-green-100" : "bg-red-100"} w-full text-center`}
              >
                {answer}
              </div>
            ))
          )}
        </div>
      </div>

      <button className="p-2 my-auto"></button>
    </div>
  );
}
