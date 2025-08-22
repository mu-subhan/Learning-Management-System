import { app } from "./app";
import dotenv from "dotenv";
import connectDB from "./utils/db";
import {v2 as cloudinary} from "cloudinary";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


// create server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    connectDB();
});
