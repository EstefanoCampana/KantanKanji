"use client"
import {useState} from "react";
import {GrMenu} from 'react-icons/gr'
import MenuComp from "./Menu";
export default function NavBarComp(){
    const [boolClick, setBoolClick] = useState(false);
    const handleClick = () => {setBoolClick(!boolClick)}
    return(
        
        <div className="flex w-full items-center justify-center">
            <GrMenu onClick={handleClick} className='absolute left-5 w-6 h-6'/>
            <p className="text 3xl text-center">簡単漢字</p>
            {boolClick && <MenuComp/>}
        </div>
    )
}