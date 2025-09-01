import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import cloudinary from "cloudinary";
import LayoutModel from "../models/layout.model";
import ErrorHandler from "../utils/ErrorHandler";

// creat layout 
export const createLayout = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {type} = req.body;

        const isTypeExist = await LayoutModel.findOne({type});
        if(isTypeExist){
            return next(new ErrorHandler(`Layout with type ${type} already exists`, 400));
        }

        if(type === "Banner"){
            const {image,title,subTitle} = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "layout"
            });
            const banner = {
                image:{
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
                title,
                subTitle
            };
            await LayoutModel.create(banner);
        }
        if(type==="FAQ"){
            const {faq} = req.body;
            const faqItem = await Promise.all(
                faq.map(async(item:any)=>{
                    return{
                        question:item.question,
                        answer:item.answer
                    }
                })
            )
            await LayoutModel.create({type:"FAQ", faq:faqItem});
        }
        if(type === "Categories"){
            const {categories} = req.body;
            const categoryItems = await Promise.all(
                categories.map(async(item:any)=>{
                    return{
                        title:item.title,
                    }
                })
            )
            await LayoutModel.create({type:"Categories", categories:categoryItems});
        }
        res.status(201).json({
            success: true,
            message: "Layout created successfully"
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
}) 