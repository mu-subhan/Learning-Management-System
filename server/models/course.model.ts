import mongoose, { Document } from "mongoose";

interface IComment extends Document{
    user:Object,
    comment:string,
}

interface IReview extends Document{
    user:Object,
    rating:number,
    comment:string,
    commentReplies:IComment[]
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

