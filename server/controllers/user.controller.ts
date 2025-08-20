require("dotenv").config();
import { Request,Response,NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { Secret } from "jsonwebtoken"
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
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

    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        refreshToken
    });

} catch (error: any) {
    console.error("Login error:", error);
    return next(new ErrorHandler("Failed to login user", 500));
}})
