import NavBarComp from "@/components/NavBar";

export default function Page(){
    return(
        <main className="flex items-center justify-center flex-col p-5">
            <NavBarComp/>
            <div className="md:w-1/2">
                <p className=" text-3xl font-black text-center p-4">Particle Practice</p>
                <p className="text-center">On this page you will be able to practice the usage of the different japanese particles.</p>

            </div>
        </main>
    )
}

[
    {
        "id": "1",
        "sentence": "今日は1.03時間で三百六七枚のカードを勉強しました",
        "particle": "を",
        "verb":"勉強しました",
        "category": "object",
        "translation": "Today, I studied 367 cards in 1.03 hours."
    }
]