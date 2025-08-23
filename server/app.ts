require("dotenv").config()
import express, { NextFunction, Request, Response } from "express"
export const app = express();
import cors from "cors"
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.routes";
import courseRouter from "./routes/course.routes";

// body parser
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

//  route 
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
// Testing api
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// Unknown route handler
app.get(/(.*)/, (req, res, next) => {
  const err: any = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});


app.use(ErrorMiddleware)