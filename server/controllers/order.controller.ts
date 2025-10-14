import userModel from "../models/user.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notificationModel";
import CourseModel from "../models/course.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { NextFunction,Request,Response } from "express";
import { getAllOrderServices, newOrder } from "../services/order.service";
import { IOrder } from "../models/orderModel";
import { redis } from "../utils/redis";
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



// interface IOrder{
//     courseId:string,
//     payment_info:string
// }


// create order 
export const createOrder= CatchAsyncError(async(
    req:Request,res:Response,next:NextFunction)=>{
try {
    const {courseId,payment_info}=req.body as IOrder;

    if(payment_info){
        if("id" in payment_info){
            const paymentIntentId = payment_info.id;
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if(paymentIntent.status !== "succeeded"){
                return next(new ErrorHandler("Payment not authorized",400))
            }
        }
    }

    const user = await userModel.findById(req.user?._id);

    const courseExistInUser = user?.courses.some((course:any)=>course.courseId?.toString()=== courseId)

    if(courseExistInUser){
        return next(new ErrorHandler("You have already purchased this course",400))
    }

    const course = await CourseModel.findById(courseId);
    if(!course){
        return next(new ErrorHandler("Course not found",404))
    }
    const data:any={
        courseId:course._id,
        userId: user?._id,
        payment_info,
    }

    newOrder(data,res,next);

    const mailData={
        order:{
            _id: String(course._id).slice(0,6),
            name:course.name,
            price:course.price,
            date: new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})

        }

    }
    const html = await ejs.renderFile(path.join(__dirname,'../mails/order-confirmation.ejs'),{order:mailData})

    try {
        if(user){
            await sendMail({
                email:user.email,
                subject:"Order Confirmation",
                template:"order-confirmation.ejs",
                data: mailData,
            })
        }
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
    user?.courses.push({ courseId: String(course._id) });
   
    await redis.set(req.user?.id,JSON.stringify(user)); 

    await user?.save();

    await NotificationModel.create({
        user:user?._id,
        title:"New Order",
        message:`You have new order from ${course?.name}`,
    })

    res.status(201).json({
        success:true,
        message:"Order created successfully",
        order: course
    })

} catch (error:any) {
    return next(new ErrorHandler(error.message,500))
}
    }
)


// get all order only for admin

export const getAllOrderService = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    getAllOrderServices(req,res,next);
  } catch (error:any) {
    return next(new ErrorHandler(error.message,500));
  }
})

// send stripe publishable key
export const sendStripePublishableKey = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        res.status(200).json({
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500));
    }
})

//  new payment
export const newPayment = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "usd",
            metadata: {
                company:"E-learning"
            },
            automatic_payment_methods: {enabled: true},
        });
        res.status(200).json({
            success:true,
            client_secret: myPayment.client_secret,
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500));
    } 
})