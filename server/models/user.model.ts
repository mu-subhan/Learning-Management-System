require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import  Jwt  from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    _id: string;
  email: string;
  name: string;
  password: string;
  avatar:{
    public_id: string;
    url: string;
  }
  role: string;
  isVerified: boolean;
  courses:Array<{courseId: string}>;
  comparedPassword:(password: string) =>Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please provide your name"],
        trim: true,

    },
    email:{
        type: String,
        required: [true,"Please provide your email"],
        unique: true,
        validate: {
            validator: (value: string) => emailRegexPattern.test(value),
            message: "Please provide a valid email"
        }
    },
    password:{
        type: String,
        // required: [true,"Please provide your password"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    },
    avatar:{
        public_id:String,
        url:String
    },
    role:{
        type: String,
        // enum: ["user", "admin"],
        default: "user"
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    courses:[{
        courseId:String,
    }]
},{timestamps:true})

// hash password before saving
userSchema.pre<IUser>("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// sign access token 
userSchema.methods.SignAccessToken = function() {
return Jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || '', {
    expiresIn: "5m"
});
}

// sign refresh token
userSchema.methods.SignRefreshToken = function() {
    return Jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || '', {
        expiresIn: "3d"
    });
}

// compare password
userSchema.methods.comparedPassword = async function(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};
const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;