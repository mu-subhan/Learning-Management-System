'use client'
import Link from 'next/link';
import React ,{ FC, useState}from 'react'
import NavItems from "../utils/NavItems"
import {ThemeSwitcher} from '../utils/ThemeSwitcher';
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi';

type Props = {
    open:boolean;
    setOpen: (open:boolean) => void;
    activeItem: number;
}

const Header:FC<Props>=({open,setOpen,activeItem})=>{

  const [active,setActive] = useState(false);
  const [openSidebar,setOpenSidebar] = useState(false);


   React.useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 80) {
      setActive(true);
    } else {
      setActive(false);
    }
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

   const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
     if ((e.target as HTMLDivElement).id === "screen") {
       setOpenSidebar(false);
     }
   }
   
  return (
    <div className='w-full relative bg-background text-foreground'>
 <div
        className={`${
          active
            ? "bg-background/80 backdrop-blur-sm top-0 left-0 w-full h-[80px] z-[80] border-b border-border shadow-xl transition duration-500"
            : "w-full border-b border-border h-[80px] z-[80] shadow-sm"
        }`}
      >
  <div className="w-[95%] md:w-[92%] m-auto py-2  h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            {/* Logo */}
            <div className="text-foreground font-Poppins font-[500] text-[25px]">
              <Link
                href={"/"}
                className="text-[25px] font-Poppins font-[500] text-foreground hover:text-primary transition-colors"
              >
                E-Learning
              </Link>
            </div>
           <div className="flex items-center">
              <NavItems
              activeItem={activeItem}
              isMobile={false}
            />
            <ThemeSwitcher />
            {/* only for mobile */}
            <div className="custom-md:hidden">
              <HiOutlineMenuAlt3
                className="cursor-pointer text-foreground hover:text-primary transition-colors"
                size={25}
                onClick={() => setOpenSidebar(true)}
              />
             
                </div>
            <HiOutlineUserCircle
                className="hidden custom-md:block cursor-pointer text-foreground hover:text-primary transition-colors"
                size={25}
                onClick={() => setOpen(true)}
                />
            </div>
          </div>
        </div>
        {/* Mobile sidebar */}
         {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] bg-black/20 backdrop-blur-sm"
            onClick={handleClose}
            id="screen"
          >
             <div className="w-[70%] fixed z-[999999999] h-screen bg-background border-l border-border top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />

            <HiOutlineUserCircle
              className="cursor-pointer ml-5 my-2 text-foreground hover:text-primary transition-colors"
              size={25}
              onClick={() => setOpen(true)}
            />
            <br />
            <br />
            <p className='text-[16px] px-2 pl-5 text-foreground/70'>Copyright © 2025 E-Learning. All rights reserved.</p>
              </div>
            </div>
          )
        }
        </div>
      </div>
  )
}

export default Header