require("dotenv").config()
import express, { NextFunction, Request, Response } from "express"
export const app = express();
import cors from "cors"
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.routes";
import courseRouter from "./routes/course.routes";
import orderRouter from "./routes/order.routes";
import notificationRoute from "./routes/notifcation.routes";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";

// body parser
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

//  route 
app.use("/api/v1", userRouter,courseRouter,orderRouter,notificationRoute,analyticsRouter,layoutRouter);

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