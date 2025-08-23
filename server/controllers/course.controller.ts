import cloudinary from 'cloudinary';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import { createCourse } from '../services/course.service';
import CourseModel from '../models/course.model';
import { redis } from '../utils/redis';


// Create Course

export const uploadCourse = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data = req.body;
        const thumbanil = data.thumbanil;
        if(thumbanil){
            const myCloud = await cloudinary.v2.uploader.upload(thumbanil,{
                folder:"courses",
                width:150,
                // crop:"scale"
            });

            data.thumbanil = {
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            };

        }
        createCourse(data, res,next);
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500) );
    }
})

// edit course
export const editCourse = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        
    const data= req.body;
    const thumbanil =data.thumbanil;
    if(thumbanil){
        
        await cloudinary.v2.uploader.destroy(thumbanil.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbanil,{
            folder:"courses",
            width:150,
            // crop:"scale"
        });

        data.thumbanil = {
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        };

    }
    
    const courseId = req.params.id;

    const course = await CourseModel.findByIdAndUpdate(
        courseId,{
            $set:data
        },
        { new: true }
    )

    res.status(201).json({
        success:true,
        course
    })

} catch (error:any) {
  return next(new ErrorHandler(error.message,500));
}
})

// get signle course -- without purchasing
export const getSingleCourse = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
       const courseId = req.params.id;
       const isCacheExist = await redis.get(courseId);
       
       if(isCacheExist){
        const course = JSON.parse(isCacheExist);
        return res.status(200).json({
            success:true,
            course
        })
       }
       else{
         const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")
        res.status(200).json({
            success:true,
            course
        });
       }

    } catch (error:any) {
        return next(new ErrorHandler(error.message,500));
    }

})

// get all courses --without purchasing

export const getAllCourses = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const isCacheExist = await redis.get("allCourses"); 
       if (isCacheExist) {
        const courses = JSON.parse(isCacheExist);
        return res.status(200).json({
            success:true,
            courses
        });
       } else {
         const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")
            await redis.set("allCourses", JSON.stringify(courses));
        res.status(200).json({
            success:true,
            courses
        })
       }

    } catch (error:any) {
        return next(new ErrorHandler(error.message,500));
    }

})


// get course content - only for valid user

export const getCourseByUser = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    
    try{
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    const courseExists = userCourseList?.find((course:any) => course._id.toString() === courseId);

    if (!courseExists) {
        return next(new ErrorHandler("You are not authorized to access this course", 403));
    }
    // console.log("course exists",courseExists);
    const course = await CourseModel.findById(courseId);
    console.log("course",course);
   console.log("course data",course?.courseData);
    const content = course?.courseData;
    console.log(content);
    res.status(200).json({
        success:true,
        content
    });

    }catch (error:any) {
        return next(new ErrorHandler(error.message,500));
    }

})
