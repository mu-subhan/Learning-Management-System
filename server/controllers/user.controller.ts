require("dotenv").config();
import { Request,Response,NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getAllUserService, getUserById } from "../services/user.services";
import cloudinary from "cloudinary";



// register user
interface IRegistrationBody{
    email: string;
    name: string;
    password: string;
    avatar?: string;
}

export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
try {
    const { email, name, password } = req.body;

    const isEmailExists = await userModel.findOne({ email });
    if (isEmailExists) {
        return next(new ErrorHandler("Email already exists", 400));
    }

    const user:IRegistrationBody={
        name,
        email,
        password,
    };

  const activationToken = createActivationToken(user);

  const activationCode = activationToken.activationCode;

  const data = {user:{name:user.name}, activationCode};

  const html = await ejs.renderFile(path.join(__dirname,"../mails/activation-mail.ejs"), data);

  try {
    await sendMail({
      email: user.email,
      subject: "Activate your account",
      template: "activation-mail.ejs",
      data,
    });
    res.status(201).json({
      success: true,
      message: "Registration successful, please check your email to activate your account.",
      activationToken: activationToken.token,
    });
  } catch (error) {
    console.error("Error sending activation email:", error);
    return next(new ErrorHandler("Failed to send activation email", 500));
  }

} catch (error) {
    console.error("Registration error:", error);
    next(new ErrorHandler("Failed to register user", 500));
}

})
interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken=(user:any):IActivationToken=>{
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign({
        user, activationCode
    }, process.env.ACTIVATION_SECRET as Secret, { expiresIn: "1d" });

    return {
        token,
        activationCode
    };
}

// activate user 
interface IActivationRequest{
    activation_code: string,
    activation_token:string,
    
}

export const activateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
       

    try {
        const {activation_code, activation_token} = req.body as IActivationRequest;

        const newUser: {user:IUser, activationCode: string} = jwt.verify(activation_token, process.env.ACTIVATION_SECRET as string) as {user: IUser, activationCode: string};

        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation token", 400));
        }

        const {name, email, password} = newUser.user;

        const existUser = await userModel.findOne({email})

        if(existUser){
            return next(new ErrorHandler("User already exists", 400));
        }
        const user = await userModel.create({
            name,
            email,
            password,
        })
        res.status(201).json({
            success:true
        })
    } catch (error) {
        console.error("Activation error:", error);
        return next(new ErrorHandler("Failed to activate user", 500));
    }
})


// Login User 

interface ILoginRequest {
    email:string,
    password:string
}

export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try{
    const { email, password } = req.body as ILoginRequest;

    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatch = await user.comparedPassword(password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }

   sendToken(user, 200, res);

} catch (error: any) {
    console.error("Login error:", error);
    return next(new ErrorHandler("Failed to login user", 500));
}})

// logout user
export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie("access_token","",{maxAge:1});
        res.cookie("refresh_token","",{maxAge:1});
       const userId = req.user?._id;

        redis.del(String(userId));

        res.status(200).json({
            success: true,
            message:"Logout Successfully",
        })
    } catch (error:any) {
    console.log("logout erro",error)  
        return next(new ErrorHandler("Failed to logout user", 500));       
    }
})

// update access token 
export const updateAccessToken = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

 try {
    
  const refresh_token = req.cookies.refresh_token as string ;
  const decoded = jwt.verify(refresh_token,process.env.REFRESH_TOKEN as string) as JwtPayload; 

  const message = "Could not refresh token"

  if(!decoded){
    return next(new ErrorHandler(message, 400));
  }
  const session = await redis.get(decoded.id as string);

  if(!session) {
    return next(new ErrorHandler(message, 400));
  }
  const user = JSON.parse(session)

  const accessToken = jwt.sign({id:user._id}, process.env.ACCESS_TOKEN as string, {
    expiresIn: "5m"
  });

  const refreshToken = jwt.sign({id:user._id}, process.env.REFRESH_TOKEN as string, {
    expiresIn: "3d"
  });

  req.user = user;

 res.cookie("access_token",accessToken,accessTokenOptions);             
 res.cookie("refresh_token",refreshToken,refreshTokenOptions);

  res.status(200).json({
    success: true,
    accessToken
  });
 } catch (error) {
    // console.log("Update access token error", error);
    return next(new ErrorHandler("Failed to update access token", 400));
 }
})

// get user info

export const getUserInfo = CatchAsyncError(async (req:Request,res:Response,next:NextFunction) => {
    try {
        const userId= req.user?._id;
        getUserById(String(userId),res)
    } catch (error) {
        return next(new ErrorHandler("Failed to get user info", 500));
    }
})

interface ISocialAuthBody{
    email:string
    name:string;
    avatar:string;
}

// socail auth

export const socailAuth = CatchAsyncError(
    async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {email,name,avatar}= req.body as ISocialAuthBody;
        const user  = await userModel.findOne({email});
        if(!user){
            const newUser = await userModel.create({
                email,
                name,
                avatar
            });
            sendToken(newUser, 201, res);
        }else{
            sendToken(user, 200, res);
        }
    } catch (error) {
        return next(new ErrorHandler("Failed to authenticate user", 400));
    }
    }
)


interface IUpdateUserInfo{
    email?: string;
    name?: string;
    
}
// user update info
export const  updateUserInfo = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    
try {
    const {name,email} = req.body as IUpdateUserInfo;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if(email&&user){
        const isEmailExist = await userModel.findOne({email});
        if(isEmailExist) {
            return next(new ErrorHandler("Email already exists", 400));
        }
        user.email = email;
    }
    if(name&&user){
        user.name = name;
    }
    await user?.save();

    await redis.set(String(userId),JSON.stringify(user))

    res.status(200).json({
        success: true,
        message: "User info updated successfully",
        user,
    });

} catch (error) {
    return next(new ErrorHandler("Failed to update user info", 500));
}
})

// update use password

interface IUpdatePassword{
    oldPassword: string;
    newPassword: string;
}

export const updatePassword=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
 try {
    const {oldPassword,newPassword} = req.body as IUpdatePassword;

    if(!oldPassword||!newPassword){
        return next(new ErrorHandler("Please provide old and new password", 400));
    }
    const user = await userModel.findById(req.user?._id).select("+password");
    if(user?.password===undefined){
        return next(new ErrorHandler("Invalid User", 404));
    }

    const isPasswordMatch = await user?.comparedPassword(oldPassword);
    
    if(!isPasswordMatch){
        return next(new ErrorHandler("Old password is incorrect", 400));
    }
    user.password = newPassword;
    await user.save();

    await redis.set(String(user._id),JSON.stringify(user)) 

    res.status(200).json({
        success: true,
        message: "Password updated successfully",
        user,
    });
 } catch (error) {
    return next(new ErrorHandler("Failed to update password", 500));
 }
    
})

interface IUpdateUserPicture{
    avatar:string;
}

// update profile picture
export const updateProfilePicture = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{

    try {
        const { avatar } = req.body;
        const userId = req.user?._id;
        const user = await userModel.findById(userId);

       if(avatar && user){
        if(user?.avatar?.public_id){
            // delete previous avatar from cloudinary
            // await user.deleteImageFromCloudinary();
            await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                folder: "avatars",
                width: 150,
                // height: 150,
                // crop: "fill"
            });
            user.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        } else {
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                folder: "avatars",
                width: 150,
                // height: 150,
                // crop: "fill"
            });
            user.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
       }

       await user?.save();
       await redis.set(String(userId),JSON.stringify(user))
       res.status(200).json({
           success: true,
           message: "Profile picture updated successfully",
           user
       });

    } catch (error) {
       console.error(error);
       let errorMessage = "An unknown error occurred";
       if (error instanceof Error) {
           errorMessage = error.message;
       }
return res.status(500).json({
    success: false,
    message: "Failed to update profile picture",
    error: errorMessage,
});
    }
})


// get all users only for admin

export const getUserService = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
       const users = await getAllUserService(res);
       res.status(200).json({
           success: true,
           message: "All users retrieved successfully",
           users
       });
    } catch (error) {
        return next(new ErrorHandler("Failed to get all users", 500));
    }
});
