import express from "express";
import { activateUser, getUserInfo, loginUser, logoutUser, registrationUser, updateAccessToken } from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/register", registrationUser);
userRouter.post("/activate-user",activateUser );
userRouter.post("/login",loginUser );
userRouter.get("/logout",isAuthenticated,logoutUser );
userRouter.get("/me",isAuthenticated,getUserInfo );
userRouter.get("/refresh",updateAccessToken);


export default userRouter;