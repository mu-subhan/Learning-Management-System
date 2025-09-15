'use client'
import React, { FC, useState } from 'react'
import SideBarProfile from "./SideBarProfile"
import { useLogOutQuery } from '@/redux/features/auth/authApi';
import { signOut } from 'next-auth/react';
import ProfileInfo from './ProfileInfo';
import ChangePassword from "./ChangePassword"

type Props = {
    user: any;
}

const Profile: FC<Props> = ({ user }) => {

    const [scroll, setScroll] = useState(false);
    const [avatar] = useState(null);
    const [active, setActive] = useState(1);
    const [logout, SetLogOut] = useState(false);

    const { } = useLogOutQuery(undefined, {
        skip: !logout ? true : false
    });

    const logOutHandler = async () => {

        SetLogOut(true);
        await signOut();

    }


    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 85) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        });
    }

    return (
        <div className='w-[85%] flex mx-auto'>
            <div
                className={`w-[60px] md:w-[310px] h-[450px] dark:bg-slate-900 bg-[#f5f5f5] bg-opacity-90 border dark:border-[#ffffff1d] border-[#00000012] rounded-[5px] shadow-md dark:shadow-sm mt-20 mb-20 sticky ${scroll ? "top-[120px]" : "top-8"
                    } left-8`}
            >
                <SideBarProfile
                    user={user}
                    active={active}
                    avatar={avatar}
                    setActive={setActive}
                    logOutHandler={logOutHandler}
                />

            </div>
            {
                active === 1 && (
                    <div className='w-full h-full bg-transparent mt-[80px]'>

                        <ProfileInfo user={user} avatar={avatar} />
                    </div>
                )
            }

             {
                active === 2 && (
                    <div className='w-full h-full bg-transparent mt-[80px]'>

                        <ChangePassword />
                    </div>
                )
            }
        </div>
    )
}

export default Profile