require("dotenv").config();
import { Request,Response,NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt ,{ JwtPayload, } from "jsonwebtoken";
import { redis } from "../utils/redis";


// AUTHENTICATED USER
export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const access_token = req.cookies.access_token;

    if(!access_token){
        return next(new ErrorHandler("Please login to access this resource", 400));

    }

    const decoded = jwt.verify(access_token,process.env.ACCESS_TOKEN as string) as JwtPayload

    if(!decoded){
        return next(new ErrorHandler("Invalid token", 400));
    }

    const user = await redis.get(decoded.id)

    if(!user){
        return next(new ErrorHandler("Please login to access this resource", 404));
    }

    req.user = JSON.parse(user);
    next();
})


// valide user role

export const authorizeRoles = (...roles:string[])=>{
    return (req:Request, res:Response, next:NextFunction) => {
        if(!req.user){
            return next(new ErrorHandler("Not authorized", 403));
        }

        if(!roles.includes(req.user?.role || '')){
            return next(new ErrorHandler("Not authorized for this resource", 403));
        }

        next();
    }
}