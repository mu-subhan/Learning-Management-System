import React, { FC, useState } from 'react'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { MdOutlineOndemandVideo } from 'react-icons/md';

type Props = {
    data: any;
    isDemo?: boolean;
     activeVideo?: number;
  setActiveVideo?: any;
}

const CourseContentList:FC<Props>= (props: Props) => {

   const [visibleSection, SetVisibleSection] = useState<Set<string>>( 
    new Set<string>()
  );

  // Find unique video sections by -->name
  const videoSection: string[] = [
    ...new Set<string>(props.data?.map((item: any) => item.videoSection)),
  ];

  let totalCount: number = 0; // To keep track of the total number of videos processed so far


  // Toggle the visibility of a section
   const toggleSection = (section: string) => {
    const newVisibleSection = new Set(visibleSection);
    if (newVisibleSection.has(section)) {
      newVisibleSection.delete(section); // collapse section
    } else {
      newVisibleSection.add(section); // expand section
    }
    SetVisibleSection(newVisibleSection);
  };
  
  return (
      <div
      className={`mt-[15px] w-full ${
        !props.isDemo && "ml-[-30px]  sticky top-24 left-0 z-30"
      }`}
    >
      {videoSection.map((section: string, sectionIndex: number) => {
        const isSectionVisible = visibleSection.has(section);
        const sectionVideos: any[] = props.data.filter(
          (item: any) => item.videoSection === section
        );
        const sectionVideoCount = sectionVideos.length;
        //Adds video lengths for the section
        const sectionVideoLength = sectionVideos.reduce(
          (totalLength: number, item: any) => totalLength + item.videoLength,
          0
        );
        const sectionStartIndex: number = totalCount;
        totalCount += sectionVideoCount;
        const sectionContentHours = sectionVideoLength / 60; //Converts to hours (floating point, 2 decimal places)
        return (
          <div
            className={`${
              !props.isDemo &&
              "border-b border-[#0000001c] dark:border-[#ffffff8e] pb-2"
            }`}
            key={section}
          >
            <div className="w-full flex">
              <div className="w-full flex justify-between items-center">
                <h2 className="text-[22px] text-black dark:text-white">
                  {section}
                </h2>
                <button
                  className="mr-4 cursor-pointer text-black dark:text-white"
                  onClick={() => toggleSection(section)}
                >
                  {/* If Section is available then */}
                  {isSectionVisible ? (
                    <BsChevronUp size={20} />
                  ) : (
                    <BsChevronDown size={20} />
                  )}
                </button>
              </div>
            </div>
            <h5 className="text-black dark:text-white">
              {sectionVideoCount} Lessons ·{" "}
              {sectionVideoLength < 60
                ? sectionVideoLength
                : sectionContentHours.toFixed(2)}
              {sectionVideoLength > 60 ? "hours" : "minutes"}
            </h5>
            <br />
            {isSectionVisible && (
              <div className="w-full">
                {sectionVideos.map((item: any, index: number) => {
                  const videoIndex: number = sectionStartIndex + index;
                  const contentLength: number = item.videoLength / 60;
                  return (
                    <div
                      className={`w-full ${
                        videoIndex === props.activeVideo ? "bg-slate-800" : ""
                      } cursor-pointer transition-all p-2`}
                      key={item._id}
                      onClick={() =>
                        props.isDemo ? null : props?.setActiveVideo(videoIndex)
                      }
                    >
                      <div className="flex items-start">
                        <div>
                          <MdOutlineOndemandVideo
                            size={25}
                            className="mr-2"
                            color="#1cdada"
                          />
                        </div>
                        <h1 className="text-[18px] inline-block break-words text-black dark:text-white">
                          {item.title}
                        </h1>
                      </div>
                      <h5 className="pl-8 text-black dark:text-white">
                        {item.videoLength > 60
                          ? contentLength.toFixed(2)
                          : item.videoLength}
                        {item.videoLength > 60 ? "hours" : "minutes"}
                      </h5>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  )
}
export default CourseContentList