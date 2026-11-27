export default function Furigana({ kana, reading }) {
  return (
    <div className="flex-1 relative">
      <p className="text-sm font-light text-black tracking-[2px] absolute left-0 right-0 top-[-20]">
        {reading}
      </p>
      <p className="text-4xl text-black font-bold">{kana}</p>
    </div>
  );
}
