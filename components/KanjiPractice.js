export default function KanjiPractice(){
    return(
        <div className="flex flex-col bg-amber-50 my-4 md:px-10 p-6 h-50 justify-center">
                <div className="flex flex-col w-full">
                    <div className="flex flex-row text-black font-bold">
                        <p className="self-start text-md">{counter}. {currentSentence.current}</p>
                        <p className="ml-auto">{(totalTime / 1000).toFixed(0)}</p>
                    </div>

                    <div className="flex mx-4 w-75 h-15 self-center items-center justify-center">
                        <p className="text-center text-black">{currentTranslation}</p>
                    </div>

                    <div className="flex items-center justify-center">
                        <input placeholder="入力" onChange={handleTextInput} onKeyDown={handleKeyDown} value={inputText} className="border-2 border-black align-middle text-center text-black"></input>
                    </div>
                </div>
        </div>
    )
}