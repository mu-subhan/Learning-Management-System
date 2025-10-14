import { useGetCourseContentQuery } from '@/redux/features/courses/courseApi';
import React, { useState } from 'react'
import Loader from '../Loader/Loader';
import CourseContentMedia from "./CourseContentMedia"
import Heading from '@/app/utils/Heading';
import Header from '../Header';
import CourseContentList from './CourseContentList';

type Props = {
    id:string;
    user:any;
}

const CourseContent = ({ id,user}: Props) => {

  const {data:contentData,isLoading,refetch}=useGetCourseContentQuery(id,{refetchOnMountOrArgChange:true});

  const [activeVideo,setActiveVideo]= useState(0);

  const [open,setOpen]= useState(false);

  const [route,setRoute]= useState("login");


  const data=contentData?.content;


  return (
   <>
   {
    isLoading? (
        <Loader/>
    ):(
       <>
       <Header 
       activeItem={1}
       open={open}
       setOpen={setOpen}
       route={route}
       setRoute={setRoute}
       />
        <div className="w-full grid md:grid-cols-10">
            <Heading 
            title={data[activeVideo].title}
            description='anything'
            keywords={data[activeVideo]?.tags}
            />
          
            <div className="col-span-7">
              <CourseContentMedia
              data={data}
              id={id}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              user={user}
              refetch={refetch}
              />
            </div>

             <div className="hidden md:block md:col-span-3">
              <CourseContentList
                setActiveVideo={setActiveVideo}
                data={data}
                activeVideo={activeVideo}
              />
            </div>
        </div>
       </>
    )
   }
   </>
  )
}

export default CourseContent