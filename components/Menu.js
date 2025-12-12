import Link from "next/link";

export default function MenuComp({ closeNav }) {
    return (
        <div onClick={closeNav} className="absolute top-0 w-full h-full md:w-1/4 md:left-0 flex items-start bg-gray-700/60 z-2">
            <div onClick={(event) => event.stopPropagation()} className="w-1/2 md:flex-1 flex flex-col bg-[#808080] p-4 gap-4">
                <Link className="mx-4" href="/">Home</Link>
                <Link className="mx-4" href="./hiraganaDrill/">Hiragana Drill</Link>
                <Link className="mx-4" href="./particlePractice/">Particle Practice</Link>
            </div>
        </div>
    )
}