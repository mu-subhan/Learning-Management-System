import { NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/orderModel";

export const newOrder = CatchAsyncError(async(data:any,res:any,next:NextFunction)=>{
    const order = await OrderModel.create(data);
    next(order);
})