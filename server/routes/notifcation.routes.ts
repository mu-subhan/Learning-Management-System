import express from "express"
import { authorizeRoles, isAuthenticated } from "../middleware/auth"
import { getNotifcation, updateNotificationStatus } from "../controllers/notification.controller"
const notificationRoute = express.Router()


notificationRoute.get("/get-all-notification",isAuthenticated,authorizeRoles("admin"),getNotifcation)

notificationRoute.put("/update-notification-status/:id",isAuthenticated,authorizeRoles("admin"),updateNotificationStatus)

export default notificationRoute;