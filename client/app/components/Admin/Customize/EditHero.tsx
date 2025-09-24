/* eslint-disable @next/next/no-img-element */
import { styles } from "../../../styles/styles";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import Loader from "../../Loader/Loader";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "../../../../redux/features/layout/layoutApi";

const EditHero = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      setTitle(data?.layout?.banner?.title);
      setSubTitle(data?.layout?.banner?.subTitle);
      setImage(data?.layout?.banner?.image?.url);
    }
    if (isSuccess) {
      refetch();
      toast.success("Hero-section updated successfully!");
    }
    if (error && "data" in error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [data, isSuccess, refetch, error]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    const data = {
      type: "Banner",
      title,
      subTitle,
      image,
    };
    await editLayout(data);
  };

  const hasChanges = 
    data?.layout?.banner?.title !== title ||
    data?.layout?.banner?.subTitle !== subTitle ||
    data?.layout?.banner?.image?.url !== image;

  // Calculate dynamic gap based on title length
  const calculateGap = () => {
    if (!title) return "mb-4";
    const titleLength = title.length;
    if (titleLength > 100) return "mb-2";
    if (titleLength > 50) return "mb-3";
    return "mb-4";
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full min-h-screen flex flex-col md:flex-row items-center justify-between px-4 md:px-8 lg:px-12 xl:px-16 py-8 md:py-0 gap-8 md:gap-0">
          
          {/* Left Side - Image Container */}
          <div className="w-full md:w-[45%] flex justify-center md:justify-start order-2 md:order-1">
            <div className="relative">
              {/* Circular Container */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[500px] xl:h-[500px] rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-1 hero_animation">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 overflow-hidden flex items-center justify-center">
                  {image ? (
                    <>
                      {/* Image with proper containment */}
                      <img
                        src={image}
                        alt="Banner"
                        className="w-full h-full object-contain rounded-full"
                      />
                      {/* Edit Icon - Always Visible on Image */}
                      <label 
                        htmlFor="banner" 
                        className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200 border-2 border-gray-300 dark:border-gray-600 z-50"
                      >
                        <CiEdit className="text-gray-700 dark:text-white text-xl md:text-2xl" />
                      </label>
                    </>
                  ) : (
                    <>
                      {/* Camera Icon when no image */}
                      <label 
                        htmlFor="banner" 
                        className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                      >
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <AiOutlineCamera className="text-gray-400 dark:text-gray-500 text-5xl mb-3" />
                          <span className="text-gray-400 dark:text-gray-500 text-sm text-center px-4">
                            Upload Banner Image
                          </span>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              </div>
              
              {/* Hidden File Input */}
              <input
                type="file"
                id="banner"
                accept="image/*"
                onChange={handleUpdate}
                className="hidden"
              />
            </div>
          </div>

          {/* Right Side - Text Content */}
          <div className="w-full md:w-[50%] flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-2">
            {/* Title with dynamic spacing */}
            <h2 className="text-2xl">Edit Title & Subtitle</h2>
            <textarea
              className="w-full lg:w-[90%] xl:w-[80%] 2xl:w-[70%] dark:text-white text-gray-900 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-Josefin leading-tight resize-none outline-none bg-transparent border-none focus:ring-0 p-2"
              placeholder="Improve Your Online Learning Experience Better Instantly"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={title?.length > 100 ? 4 : title?.length > 50 ? 3 : 2}
            />
            
            {/* Dynamic gap between title and subtitle */}
            <div className={calculateGap()}></div>
            
            {/* Subtitle */}
            <textarea
              className="w-full lg:w-[90%] xl:w-[80%] 2xl:w-[70%] dark:text-gray-300 text-gray-600 text-base md:text-lg lg:text-xl font-Josefin font-medium leading-relaxed resize-none outline-none bg-transparent border-none focus:ring-0 p-2"
              placeholder="Learn from the best instructors and take your skills to the next level."
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              rows={subTitle?.length > 150 ? 4 : subTitle?.length > 75 ? 3 : 2}
            />

            {/* Save Button with dynamic positioning */}
            <div className={`mt-6 ${title?.length > 100 || subTitle?.length > 150 ? 'mt-8' : 'mt-6'}`}>
              <button
                className={`${styles.button} w-32 h-12 text-base font-semibold rounded-lg transition-all duration-300 ${
                  hasChanges
                    ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white cursor-pointer shadow-lg"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
                onClick={hasChanges ? handleEdit : undefined}
                disabled={!hasChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditHero;