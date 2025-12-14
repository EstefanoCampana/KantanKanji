import Link from "next/link";

export default function MenuComp({ closeNav }) {
    return (
        <div onClick={closeNav} className="fixed inset-0 flex items-start bg-gray-700/60 z-2">
            <div onClick={(event) => event.stopPropagation()} className="w-1/2 md:w-1/4 h-full flex flex-col bg-[#808080] p-4 gap-4">
                <Link className="mx-4" href="/">Home</Link>
                <Link className="mx-4" href="./hiraganaDrill/">Hiragana Drill</Link>
                <Link className="mx-4" href="./kanjiPractice/">Kanji Practice</Link>
                <Link className="mx-4" href="./particlePractice/">Particle Practice</Link>
            </div>
        </div>
    )
}