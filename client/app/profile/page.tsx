'use client'
import React, {useState } from 'react'
import Protected from '../hooks/useProctected'
import Heading from '../utils/Heading'
import Header from '../components/Header'
import Profile from "../components/Profile/Profile"
import { useSelector } from 'react-redux'



const Page=() => {

    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(5);
    const [route, setRoute] = useState("Login");
    const {user} = useSelector((state:any)=> state.auth)

    return (
        <div>
            <Protected>
                <Heading
                    title={`${user?.name} profile`}
                    description="E-Learning is a Platform for students to learn and get help from teachers."
                    keywords="Programming,MERN,Redux,Machine Learning"
                />
                <Header
                    open={open}
                    setOpen={setOpen}
                    activeItem={activeItem}
                    route={route}
                    setRoute={setRoute}
                />
                <Profile user={user} />
            </Protected>
        </div>
    )
}

export default Page