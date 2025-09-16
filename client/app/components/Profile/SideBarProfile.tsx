
import Image from 'next/image';
import React, { FC } from 'react';
import avatarDefault from "../../../public/assets/avatardefault.jpg"
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { AiOutlineLogout } from 'react-icons/ai';
import Link from 'next/link';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

type Props = {
    user:any;
    active:number;
    avatar:string | null;
    setActive:(active:number) =>void;
    logOutHandler:any;
}

const SideBarProfile:FC<Props> = ({user,active,avatar,setActive,logOutHandler}) => {
  return (
    <div className='w-full'>
         <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 1 ? "dark:bg-slate-800  bg-blue-50" : "bg-transparent"
        }`}
        onClick={() => setActive(1)}
      >
        <Image
          alt="user avatar"
          src={
            user.avatar || avatar ? user.avatar.url || avatar : avatarDefault
          }
          width={20}
          height={20}
          className=" cursor-pointer rounded-full"
        />
         <h5 className="pl-2 md:block hidden font-Poppins dark:text-white text-black ">
          My Account
        </h5>
        </div>
        {/* changes passsword */}
        <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 2 ? "dark:bg-slate-800  bg-white" : "bg-transparent"
        }`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} className="dark:text-white text-black" />
        <h5 className="pl-2 md:block hidden font-Poppins dark:text-white text-black ">
          Change Password
        </h5>
      </div>
       {/* Enrolled Courses */}
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 3 ? "dark:bg-slate-800  bg-white" : "bg-transparent"
        }`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} className="dark:text-white text-amber-300" />
        <h5 className="pl-2 md:block hidden font-Poppins dark:text-white text-black ">
          Enrolled Courses
        </h5>
      </div>
        {/* admin protected Route  */}
      {user.role === "admin" && (
        <Link
          href={"/admin"}
          className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 4 ? "dark:bg-slate-800  bg-white" : "bg-transparent"
          }`}
          onClick={() => setActive(4)}
        >
          <MdOutlineAdminPanelSettings
            size={20}
            className="dark:text-white text-black"
          />
          <h5 className="pl-2 md:block hidden font-Poppins dark:text-white text-black ">
            Admin Dashboard
          </h5>
        </Link>
      )}
      {/* logout */}
       <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 5 ? "dark:bg-slate-800  bg-white" : "bg-transparent"
        }`}
        onClick={() => logOutHandler()}
      >
        <AiOutlineLogout size={20} className="dark:text-white text-black" />
        <h5 className="pl-2 md:block hidden font-Poppins dark:text-white text-black ">
          Log Out
        </h5>
      </div>
    </div>
  )
}


export default SideBarProfile