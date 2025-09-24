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
                type:"Banner",
                banner:{
                image:{
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
                title,
                subTitle,
            },
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

// edit layout
export const editLayout = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
   try{
    const {type} = req.body;

    if(type === "Banner"){
        const bannerData:any = await LayoutModel.findOne({type:"Banner"});
        if(!bannerData){
            return next(new ErrorHandler(`Banner not found`, 404));
        }
        const {image,title,subTitle} = req.body;
        const data=image.startsWith('https')? bannerData: await cloudinary.v2.uploader.upload(image, {
        folder: "layout",
    });
    const banner = {
    type: "Banner",
    image: {
        public_id:image.startsWith('https')?bannerData.banner.image.public_id:data.public_id,
        url: image.startsWith('https') ?bannerData.banner.image.url:data.secure_url,
    },
    title,
    subTitle,
    };

    await LayoutModel.findByIdAndUpdate(bannerData._id, {banner});

   }
   if(type === "FAQ"){
       const faqData:any = await LayoutModel.findOne({type:"FAQ"});
       if(!faqData){
           return next(new ErrorHandler(`FAQ not found`, 404));
       }
       const {faq} = req.body;
       const faqItem = await Promise.all(
           faq.map(async(item:any)=>{
               return{
                   question:item.question,
                   answer:item.answer
               }
           })
       )
       await LayoutModel.findOneAndUpdate(faqData?._id,{type:"FAQ",faq:faqItem});
   }
   if(type === "Categories"){
       const categoryData:any = await LayoutModel.findOne({type:"Categories"});
       if(!categoryData){
           return next(new ErrorHandler(`Categories not found`, 404));
       }
       const {categories} = req.body;
       const categoryItems = await Promise.all(
           categories.map(async(item:any)=>{
               return{
                   title:item.title,
               }
           })
       )
       await LayoutModel.findOneAndUpdate(categoryData?._id,{ type:"Categories", categories:categoryItems});
   }
    res.status(200).json({
        success: true,
        message: "Layout updated successfully"
    });
} catch (error:any) {
   return next(new ErrorHandler(error.message, 500));
}
});


// get layout by type
export const getLayoutByType = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
   try {
     const {type} = req.params;
    const layout = await LayoutModel.findOne({type});
    if(!layout){
        return next(new ErrorHandler(`Layout not found`, 404));
    }
    res.status(200).json({
        success: true,
        message: "Layout fetched successfully",
        layout
    });
   } catch (error:any) {
       return next(new ErrorHandler(error.message, 500));
   }
});