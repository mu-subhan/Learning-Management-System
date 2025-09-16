'use client'
import React, { useState } from 'react'
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";


type Props = {}

const CreateCourse = (props: Props) => {
      const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    categories: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
  });
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoLength: "",
      videoSection: "untitled Section",
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    },
  ]);
  const [courseData, setCourseData] = useState({});


  const handleSubmit =async ()=>{

  }
  const handleCourseCreate = async()=>{

  }
  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            // courseContentData={courseContentData}
            // setCourseContentData={setCourseContentData}
            // active={active}
            // setActive={setActive}
            // handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            // courseData={courseData}
            // handleCourseCreate={handleCourseCreate}
            // active={active}
            // setActive={setActive}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0  p-4">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  )
}

export default CreateCourse