import { formatTime } from "@/utils/functions";
import BackButton from "./BackButton";

export default function RoundEndScreen({ totalTime, bestTime, playAgain }) {
  return (
    <div className="flex flex-col items-center my-auto gap-4 text-center">
      <div>
        <p className="text-black font-extrabold text-2xl">
          You finished in {formatTime(totalTime)}!
        </p>
        <p className="text-black font-medium">
          Your best time is {formatTime(bestTime)}
        </p>
      </div>
      {/*Buttons div*/}
      <div className="flex flex-row self-center gap-4">
        <BackButton variant={"endScreen"} />
        <button
          onClick={playAgain}
          className="w-full bg-black text-white font-bold rounded 2xl p-2 mt-2 cursor-pointer"
        >
          Play again
        </button>
      </div>
    </div>
  );
}
