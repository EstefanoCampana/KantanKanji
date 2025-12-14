"use client"
import { GrMenu } from 'react-icons/gr'
import MenuComp from "./Menu";
import { useNavBar } from "@/utils/navBarProvider";
export default function NavBarComp() {
    const { boolClick, handleBool } = useNavBar();
    const handleClick = handleBool;
    return (
        <div className="relative z-40 flex w-full justify-center">
            <GrMenu onClick={handleClick} className='absolute left-5 w-6 h-6' />
            <p className="text 3xl text-center">簡単漢字</p>
            {boolClick && <MenuComp closeNav={handleClick} />}
        </div>
    )
}