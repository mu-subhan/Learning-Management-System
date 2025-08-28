import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/orderModel";

export const newOrder = CatchAsyncError(async(data:any,res:Response,next:NextFunction)=>{
   const order =  await OrderModel.create(data);
     res.status(201).json({
        success:true,
        message:"Order created successfully",
        order,
    })
})

export const getAllOrderServices = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
   const orders = await OrderModel.find();
   res.status(200).json({
       success:true,
       message:"All orders retrieved successfully",
       orders
   })
})