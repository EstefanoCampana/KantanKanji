import { formatTime } from "@/utils/functions";
import Image from "next/image";

export function GameCard({
  image,
  title,
  action,
  selected = false,
  bestTime = null,
}) {
  return (
    <div
      className={`flex flex-col w-full min-h-0 border-2 mx-2 border-black hover:cursor-pointer ${selected ? `bg-green-300 text-black` : `bg-gray-500 text-white`}`}
      onClick={action}
    >
      <div></div>
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <Image
          className="object-cover"
          src={image}
          alt="thumbnail"
          fill
          sizes="(max-width:768px) 100vw, 250px"
        ></Image>
      </div>
      <div className="flex py-2 text-center justify-center shrink-0">
        <h1 className="font-black">
          {title} <br />
          {bestTime != null && (
            <p className="font-medium">{formatTime(bestTime)}</p>
          )}
        </h1>
      </div>
    </div>
  );
}
