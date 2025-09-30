import express from "express";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "../controllers/analytic.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";

const analyticsRouter = express.Router();

analyticsRouter.get('/get-user-analytics',updateAccessToken,isAuthenticated,authorizeRoles("admin"), getUserAnalytics);



analyticsRouter.get('/get-course-analytics',updateAccessToken,isAuthenticated,authorizeRoles("admin"), getCourseAnalytics);

analyticsRouter.get('/get-order-analytics',updateAccessToken,isAuthenticated,authorizeRoles("admin"), getOrderAnalytics);

export default analyticsRouter;