import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";
import { time, timeStamp } from "console";

interface IComment extends Document{
    user:IUser,
    question:string,
    questionReplies:IComment[]
}

interface IReview extends Document{
    user: IUser,
    rating:number,
    comment:string,
    commentReplies?:IComment[]
}

interface ILink extends Document{
    title:string,
    url:string
}

interface ICouseData extends Document{
    title:string;
    description:string;
    videoUrl:string;
    videoThumbnail:string;
    videoSection:string;
    videoLength:string;
    videoPlayer:string;
    links:ILink[];
    suggestion:string;
    questions:IComment[];
}

interface ICourse extends Document{
    name:string;
    description:string;
    price:number;
    estimatedPrice:number;
    thumbnail:string;
    tags:string;
    level:string;
    benefits:{title:string}[];
    prerequisites:{title:string}[];
    reviews:IReview[];
    courseData:ICouseData[];
    rating:number;
    purchased:number;
}

const reviewSchema = new Schema<IReview>({
    user:Object,
    rating:{
        type:Number,
        default:0,
    },
    comment:String,
    commentReplies:[Object],
});

const linkSchema = new Schema<ILink>({
    title:String,
    url:String
});

const commentSchema = new Schema<IComment>({
    user:Object,
    question:String,
    questionReplies:[Object]
});

const courseDataSchema = new Schema<ICouseData>({
    title:String,
    description:String,
    videoUrl:String,
    videoSection:String,
    videoLength:Number,
    videoPlayer:String,
    links:[linkSchema],
    suggestion:String,
    questions:[commentSchema]
});

const courseSchema = new Schema<ICourse>({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    estimatedPrice:{
        type:Number,
     
    },
    thumbnail:{
       public_id:{
         type:String,
       
    }
    },
    tags:{
        type:String,
        required:true,
    },
    level:{
        type:String,
        required:true,
    },
    benefits:[{
        title:{
            type:String,
          
        }
    }],
    prerequisites:[{
        title:{
            type:String,
          
        }
    }],
    reviews:[reviewSchema],
    courseData:[courseDataSchema],
    rating:{
        type:Number,
        default:0,
    },
    purchased:{
        type:Number,
        default:0,
    }
}, { timestamps: true });
const CourseModel:Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;