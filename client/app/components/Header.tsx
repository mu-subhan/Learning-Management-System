'use client'
import Link from 'next/link';
import React, { FC, useState } from 'react'
import NavItems from "../utils/NavItems"
import { ThemeSwitcher } from '../utils/ThemeSwitcher';
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi';
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login"
import SignUp from "../components/Auth/SignUp";
import Verfication from "../components/Auth/Verfication"
import { useSelector } from 'react-redux';
import Image from 'next/image';
import avatar from "../../public/assets/avatardefault.jpg"
import { useSession } from 'next-auth/react';
import { useSocialAuthMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
}

const Header: FC<Props> = ({ open, setOpen, activeItem, route, setRoute }) => {

  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth)
  const { data: session, status } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();

  // Prevent duplicate social auth linking and toasts (StrictMode double-invoke, remounts)
  const hasLinkedRef = React.useRef(false);

  // Trigger social auth only once when NextAuth session is authenticated and no redux user
  React.useEffect(() => {
    if (hasLinkedRef.current) return; // dont call if already called prevent dublicate call
    if (status !== 'authenticated') return; // wait for session to be authenticated first to avoid double calling
    if (user) return;  // dont call id user already exists

    if (session?.user?.email) {
      // hasLinkedRef.current = true; mark as called
      socialAuth({
        email: session.user.email,
        name: session.user.name,
        avatar: session.user.image,
      });
    }
  }, [status, session, user, socialAuth]);

  // Show toast once based on mutation result
  React.useEffect(() => {
    if (isSuccess) {
      toast.success("User logged in successfully");
    }
    if (error) {
      toast.error("Something went wrong");
    }
  }, [isSuccess, error]);

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
  // console.log("user data",user);


  return (
    <div className='w-full relative bg-background text-foreground'>
      <div
        className={`${active
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
              {
                user ? (
                  <Link href={"/profile"}>
                    <Image
                      src={user.avatar ? user.avatar.url : avatar}
                      alt="user profile"
                      width={30}
                      height={30}
                      className='w-8 h-8 rounded-full cursor-pointer'
                      style={{border:activeItem === 5 ? "2px solid #30bbb2ca" : "none"}}
                    />

                  </Link>
                ) : (
                  <HiOutlineUserCircle
                    className="hidden custom-md:block cursor-pointer text-foreground hover:text-primary transition-colors"
                    size={25}
                    onClick={() => setOpen(true)}
                  />
                )
              }
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


      {/* for login */}
      {
        route === "Login" && (
          <>
            {open && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={Login}
              />
            )}
          </>
        )
      }

      {/* for signup */}

      {
        route === "Sign-Up" && (
          <>
            {open && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={SignUp}
              />
            )}
          </>
        )
      }

      {
        route === "Verfication" && (
          <>
            {open && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={Verfication}
              />
            )}
          </>
        )
      }

    </div>
  )
}

export default Header