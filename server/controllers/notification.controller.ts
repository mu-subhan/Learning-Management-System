import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import NotificationModel from "../models/notificationModel";
import cron from "node-cron";


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


//  cron working example 

//  cron.schedule('*/5 * * * * *', () => {
//    console.log('running a task every 5 seconds');
//  });


// delete notification only for admin 
cron.schedule('0 0 0 * * *',async()=>{
    const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000);
   await NotificationModel.deleteMany({ status: "read", createdAt: { $lt: thirtyDaysAgo } });
   console.log('Deleted read notifications older than 30 days');
})