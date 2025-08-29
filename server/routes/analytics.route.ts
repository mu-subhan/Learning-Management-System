import express from "express";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "../controllers/analtic.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const analyticsRouter = express.Router();

analyticsRouter.get('/get-user-analytics',isAuthenticated,authorizeRoles("admin"), getUserAnalytics);



analyticsRouter.get('/get-course-analytics',isAuthenticated,authorizeRoles("admin"), getCourseAnalytics);

analyticsRouter.get('/get-order-analytics',isAuthenticated,authorizeRoles("admin"), getOrderAnalytics);

export default analyticsRouter;