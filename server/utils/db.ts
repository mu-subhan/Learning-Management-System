require("dotenv").config();
import mongoose from "mongoose";

const MONGO_URI: string = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

const connectDB = async () => {
  try {
    const data = await mongoose.connect(MONGO_URI);
    console.log(`Mongo connected with host: ${data.connection.host}`);
  } catch (error: any) {
    console.error("Mongo connection error:", error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
