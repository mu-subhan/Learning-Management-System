import express from "express";
import { activateUser, deleteUser, getUserInfo, getUserService, loginUser, logoutUser, registrationUser, socailAuth, updateAccessToken, updatePassword, updateProfilePicture, updateUserInfo, updateUserRole } from "../controllers/user.controller";
import {  authorizeRoles, isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user",activateUser );
userRouter.post("/login",loginUser );
userRouter.get("/logout",updateAccessToken,isAuthenticated,logoutUser );
userRouter.get("/me",updateAccessToken,isAuthenticated,getUserInfo );
userRouter.get("/refresh",updateAccessToken);
userRouter.post("/social-auth",socailAuth);
userRouter.put("/update-user-info",updateAccessToken,isAuthenticated,updateUserInfo);
userRouter.put("/update-user-password",updateAccessToken,isAuthenticated,updatePassword);
userRouter.put("/update-profile-picture",updateAccessToken,isAuthenticated,updateProfilePicture);

userRouter.get("/get-users",updateAccessToken,isAuthenticated,authorizeRoles("admin"),getUserService);

userRouter.put("/update-user-role",updateAccessToken,isAuthenticated,authorizeRoles("admin"),updateUserRole);

userRouter.delete("/delete-user/:id",updateAccessToken,isAuthenticated,authorizeRoles("admin"),deleteUser);

export default userRouter;
