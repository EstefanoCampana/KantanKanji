import Link from "next/link";

export default function MenuComp(){
    return(
        <div className="flex flex-col bg-[#808080] absolute left-0 top-10 w-1/2 md:w-1/4">
            <Link href="/">Home</Link>
            <Link href="./hiraganaDrill/">Hiragana Drill</Link>
            <Link href="./particlePractice/">Particle Practice</Link>
        </div>
    )
}