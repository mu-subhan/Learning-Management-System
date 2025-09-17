import React, { FC } from 'react'
import CoursePlayer from "../../../utils/CoursePlayer"
import { styles } from '../../../../app/styles/styles';
import Ratings from "../../../utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

type Props = {
  courseData: any;
  handleCourseCreate: any;
  active: number;
  setActive: (active: number) => void
  isEdit?: boolean;
}

const CoursePreview: FC<Props> = ({ courseData, handleCourseCreate, active, setActive, isEdit }) => {
  const discountPercentage =
    ((courseData?.estimatedPrice - courseData?.price) /
      courseData?.estimatedPrice) *
    100;
  // Converts discount percentage to a whole number string
  const discountPercentagePrice = discountPercentage.toFixed(0);

  const prevButton = () => {
    setActive(active - 1);
  };

  const createCourse = () => {
    handleCourseCreate();
  };


  return (
    <div className='w-[90%] m-auto py-5 mb-5'>
      <div className="w-full relative">
        <div className="w-full mt-8">
          <CoursePlayer
            videoUrl={courseData?.demoUrl}
            title={courseData?.title}
          />
        </div>
        <div className="flex items-center">
          <h1 className="pt-5 text-[25px] dark:text-white text-black">
            {courseData?.price === 0 ? "Free" : courseData?.price + "$"}
          </h1>
          <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 dark:text-gray-400 text-gray-600">
            {courseData?.estimatedPrice}$
          </h5>
          <h4 className="pl-5 pt-4 text-[22px] text-[#37a39a] dark:text-[#3ccba0]">
            {discountPercentagePrice}% Off
          </h4>
        </div>
        <div className="flex items-center">
          <div
            className={`${styles.button} !w-[180px] my-3 font-Poppins !bg-[crimson] cursor-not-allowed dark:!bg-[#b91c1c] dark:!text-white`}
          >
            Buy Now {courseData?.price}$
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            name=""
            id=""
            placeholder="Discount code..."
            className={`${styles.input} 1500px:!w-[50%] 1100px:w-[60%] ml-3 !mt-0 dark:!bg-[#1a2236] dark:!text-white dark:!border-[#2d3a4e]`}
          />
          <div
            className={`${styles.button} !w-[120px] my-3 ml-4 font-Poppins cursor-pointer dark:!bg-[#37a39a] dark:!text-white`}
          >
            Apply
          </div>
        </div>
        <p className="pb-1 dark:text-[#b5e3d8] text-[#222]">
          • Source code included
        </p>
        <p className="pb-1 dark:text-[#b5e3d8] text-[#222]">
          • Full lifetime access
        </p>
        <p className="pb-1 dark:text-[#b5e3d8] text-[#222]">
          • Certificate of completion
        </p>
        <p className="pb-3 md:pb-1 dark:text-[#b5e3d8] text-[#222]">
          • Premium Support
        </p>
        <div className="w-full">
          <div className="w-full md:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] dark:text-white text-black">
              {courseData?.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={0} />

                <h5 className="dark:text-gray-300 text-gray-700">0 Reviews</h5>
              </div>
              <h5 className="dark:text-gray-300 text-gray-700">0 Students</h5>
            </div>
            <br />
            <h1 className="text-[25px] font-Poppins font-[600] dark:text-white text-black">
              What you will learn from this course?
            </h1>
          </div>
          {courseData?.benefits?.map((item: any, index: number) => (
            <div className="w-full flex md:items-center py-2" key={index}>
              <div className="w-[15px] mr-1 text-[#37a39a] dark:text-[#3ccba0]">
                <IoCheckmarkDoneOutline size={20} />
              </div>
              <p className="pl-2 dark:text-white text-black">{item.title}</p>
            </div>
          ))}
          <br />
          <br />
          <br />
          <h1 className="text-[25px] font-Poppins font-[600] dark:text-white text-black">
            What are the prerequisites for starting this course?
          </h1>
          {courseData?.prerequisites?.map((item: any, index: number) => (
            <div className="w-full flex md:items-center py-2" key={index}>
              <div className="w-[15px] mr-1 text-[#37a39a] dark:text-[#3ccba0]">
                <IoCheckmarkDoneOutline size={20} />
              </div>
              <p className="pl-2 dark:text-white text-black">{item.title}</p>
            </div>
          ))}
          <br />
          <br />
          <div className="w-full">
            <h1 className="text-[25px] font-Poppins font-[600] dark:text-white text-black">
              Course Details
            </h1>
            <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden dark:text-gray-200 text-gray-800">
              {courseData?.description}
            </p>
          </div>
          <br />
          <br />
        </div>

        <div className="w-full flex items-center justify-between">
          <div
            className="w-full md:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 m-[20px] cursor-pointer"
            onClick={prevButton}
          >
            Prev
          </div>
          <div
            className="w-full md:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 m-[20px] cursor-pointer"
            onClick={createCourse}
          >
            {isEdit ? "Update" : "Create"}
          </div>
        </div>
      </div>
    </div>
  );
}


export default CoursePreview