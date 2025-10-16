'use client';
import { useGetUsersAllCoursesQuery } from '@/redux/features/courses/courseApi';
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader/Loader';
import Header from '../components/Header';
import Heading from '../utils/Heading';
import CourseCard from '../components/Courses/CourseCard';
import { styles } from '../styles/styles';
import Footer from '../components/Route/Footer';

type Props = {}

const CoursesContent  = (props: Props) => {

    const searchParams=useSearchParams();
  const searchTerm = searchParams?.get("title");

  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: categories } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState("All");
  const layoutCategories = categories?.layout?.categories;



   useEffect(()=>{
       if(searchTerm){
           setCourses(data?.courses?.filter((course:any)=>course.name.toLowerCase().includes(searchTerm.toLowerCase())))
       }
    else if(category === "All"){
        setCourses(data?.courses)
    }
    else{
        setCourses(data?.courses?.filter((course:any)=>course.categories === category))
   }

},[category, data, searchTerm])

   
  return (
    <div>
{
    isLoading ? (
  <Loader/>
    ):(
 <>
 <Header
        route={route}
        setRoute={setRoute}
        open={open}
        setOpen={setOpen}
        activeItem={1}
        />
        <div className="w-[95%] md:w-[85%] m-auto min-h-[70vh]">
            <Heading
              title={"All courses - LMS"}
              description={"LMS is a programming community."}
              keywords={
                "programming community, coding skills, expert insights, collaboration, growth"
              }
            />
            <br />
             <div className="w-full flex items-center flex-wrap">
              <div
                className={`h-[35px] ${
                  category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
                } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                onClick={() => setCategory("All")}
              >
                All
              </div>

               {layoutCategories &&
                layoutCategories.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                      className={`h-[35px] ${
                        category === item.title
                          ? "bg-[crimson]"
                          : "bg-[#5050cb]"
                      } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                      onClick={() => setCategory(item.title)}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
            </div>
            {courses && courses.length === 0 && (
              <p
                className={`${styles.label} justify-center min-h-[50vh] flex items-center`}
              >
                {searchTerm
                  ? "No courses found!"
                  : "No courses found in this category. Please try another one!"}
              </p>
            )}
            <br />
            <br />
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
              {!isLoading&&courses &&
                courses.map((item: any, index: number) => (
                  <CourseCard item={item} key={index} />
                ))}
            </div>
            </div>
            <Footer />
 </>
    )
}
    </div>
  )
}

export default CoursesContent 