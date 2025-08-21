require("dotenv").config()
import { NextFunction, Response } from "express"
import { IUser } from "../models/user.model"
import { redis } from "./redis"

interface ITokenOptions {
    expires:Date;
    maxAge: number;
    httpOnly:boolean;
    sameSite:"strict" | "lax" | "none" | undefined;
    secure:boolean;
}

//    parse enviroment varible to integrates wtih fallback values
   export const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300',10)
   export const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '86400',10)

    
     // OPTIONS FOR COOKIES
    
      export const accessTokenOptions:ITokenOptions = {
          expires: new Date(Date.now() + accessTokenExpire *60*60* 1000),
          maxAge: accessTokenExpire * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'lax',
          secure: false
      };

      export const refreshTokenOptions:ITokenOptions = {
          expires: new Date(Date.now() + refreshTokenExpire * 24*60*60* 1000),
          maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'lax',
          secure: false
      };


export const sendToken = (user:IUser,statusCode:number,res:Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();
  

//   upload session to redis
  redis.set(String(user._id), JSON.stringify(user) as any)


    //   only set secure to true in production
    if(process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
        refreshTokenOptions.secure = true;

    }

    res.cookie("access_token",accessToken,accessTokenOptions)
    res.cookie("refresh_token",refreshToken,refreshTokenOptions)

    res.status(statusCode).json({
        success:true,
        user,
        accessToken,
    })


}