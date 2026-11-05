import Image from "next/image";

export default function SentenceStructure() {
  return (
    <div className="flex flex-col flex-1 bg-gray-300 p-2">
      <div className="flex flex-1 flex-col min-h-0">
        <p className="text-2xl font-black text-black text-center">
          Structure Selection
        </p>
        <div className="flex flex-row flex-1 justify-evenly my-auto min-h-0">
          <StructureOption />
        </div>
      </div>
    </div>
  );
}

function StructureOption() {
  return (
    <div
      className={`flex flex-col flex-1 min-h-0 p-4 mx-2 bg-green-500 hover:bg-green-500/50 hover:cursor-pointer`}
    >
      <div></div>
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <Image
          className="object-cover"
          src="/placeholder.png"
          alt="thumbnail"
          fill
          sizes="(max-width:768px) 100vw, 250px"
        ></Image>
      </div>
      <div className="flex py-2 shrink-0">
        <h1 className="text-white font-black">
          <br />
          <p className="font-medium"></p>
        </h1>
      </div>
    </div>
  );
}
