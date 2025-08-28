import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import NotificationModel from "../models/notificationModel";


// get all notification for admin 
export const getNotifcation = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
       const notification = await NotificationModel.find().sort({createdAt:-1})
       
       res.status(200).json({
        success:true,
        notification,
       })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})

// update the notification status 

export const updateNotificationStatus = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const notification = await NotificationModel.findById(req.params.id);

        if(!notification){
            return next(new ErrorHandler("Notification not found",404))
        } else{
            notification.status ? notification.status = "read":notification?.status;
        }
        await notification.save();

        const notifications = await NotificationModel.find().sort({createdAt:-1});

        res.status(201).json({
            success:true,
            message:"Notification status updated successfully",
            notifications,
        })

    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})