import express from "express";
import { activateUser, deleteUser, getUserInfo, getUserService, loginUser, logoutUser, registrationUser, socailAuth, updateAccessToken, updatePassword, updateProfilePicture, updateUserInfo, updateUserRole } from "../controllers/user.controller";
import {  authorizeRoles, isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user",activateUser );
userRouter.post("/login",loginUser );
userRouter.get("/logout",isAuthenticated,logoutUser );
userRouter.get("/me",isAuthenticated,getUserInfo );
userRouter.get("/refresh",updateAccessToken);
userRouter.post("/social-auth",socailAuth);
userRouter.put("/update-user-info",isAuthenticated,updateUserInfo);
userRouter.put("/update-user-password",isAuthenticated,updatePassword);
userRouter.put("/update-profile-picture",isAuthenticated,updateProfilePicture);

userRouter.get("/get-users",isAuthenticated,authorizeRoles("admin"),getUserService);

userRouter.put("/update-user-role",isAuthenticated,authorizeRoles("admin"),updateUserRole);

userRouter.delete("/delete-user/:id",isAuthenticated,authorizeRoles("admin"),deleteUser);

export default userRouter;
