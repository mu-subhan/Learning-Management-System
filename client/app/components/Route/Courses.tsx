import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/courseApi";
import React, { useEffect, useState } from "react";
import CourseCard from "../Courses/CourseCard";

const Courses = () => {
  const { data, refetch } = useGetUsersAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => {
    refetch();
    setCourses(data?.courses);
  }, [data,refetch]);
  // console.log("courses",data?.courses);

  return (
    <div>
      <div className={`w-[90%] md:w-[80%] m-auto`}>
        <h1 className="text-center font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white md:!leading-[60px] text-[#000] font-[700] tracking-tight">
          Expand Your Career <span className="text-gradient">Opportunity</span>
          <br />
          Opportunity With Our Courses
        </h1>
        <br />
        <br />
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] custom-4xl:grid-cols-4 custom-4xl:gap-[35px] mb-12 border-0">
          {courses &&
            courses.map((item: any, index: number) => (
              <CourseCard item={item} key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;