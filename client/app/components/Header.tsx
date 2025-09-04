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
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}
      >
  <div className="w-[95%] md:w-[92%] m-auto py-2  h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            {/* Logo */}
            <div className="text-foreground font-Poppins font-[500] text-[25px]">
              <Link
                href={"/"}
                className="text-[25px] font-Poppins font-[500] text-black dark:text-white "
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
            <div className="md:hidden">
              <HiOutlineMenuAlt3
                className="text-black dark:text-white"
                size={25}
                onClick={() => setOpenSidebar(true)}
              />
              </div>
              <HiOutlineUserCircle
                className="cursor-pointer text-black dark:text-white"
                size={25}
                onClick={() => setOpen(true)}
              />
            </div>
          </div>
        </div>
        {/* Mobile sidebar */}
         {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
             <div className="w-[70%] fixed z-[999999999] h-screen bg-white top-0 right-0 dark:bg-slate-900 dark:bg-opacity-90">
              <NavItems activeItem={activeItem} isMobile={true} />

            <HiOutlineUserCircle
              className="cursor-pointer ml-5 my-2 text-black dark:text-white"
              size={25}
              onClick={() => setOpen(true)}
            />
            <br />
            <br />
            <p>Copyright © 2025 E-Learning. All rights reserved.</p>
              </div>
            </div>
          )
        }
        </div>
      </div>
  )
}

export default Header