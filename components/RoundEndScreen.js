import { formatTime } from "@/utils/functions";

export default function RoundEndScreen({ totalTime, bestTime, back }) {
  return (
    <div className="flex flex-col items-center my-auto">
      <p className="text-black font-extrabold text-2xl">
        You finished in {formatTime(totalTime)}!
      </p>
      <p className="text-black font-medium">Your best time is {bestTime}</p>
      <button
        onClick={back}
        className="bg-black text-white font-bold rounded 2xl p-2 mt-2"
      >
        Back
      </button>
    </div>
  );
}
