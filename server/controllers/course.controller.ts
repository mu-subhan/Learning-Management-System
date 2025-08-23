import cloudinary from 'cloudinary';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import { createCourse } from '../services/course.service';
import CourseModel from '../models/course.model';


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
        const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")
        res.status(200).json({
            success:true,
            course
        })
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500));
    }

})
