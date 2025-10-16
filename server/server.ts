import { app } from "./app";
import dotenv from "dotenv";
import connectDB from "./utils/db";
import {v2 as cloudinary} from "cloudinary";
import http from "http"
import { initSocketServer } from "./socketServer";

dotenv.config();

const server = http.createServer(app)

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// connect the socket server
initSocketServer(server);

// create server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    connectDB();
});
