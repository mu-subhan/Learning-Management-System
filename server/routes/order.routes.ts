import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import { createOrder, getAllOrderService, newPayment, sendStripePublishableKey } from '../controllers/order.controller';
import { updateAccessToken } from '../controllers/user.controller';

const orderRouter = express.Router();

orderRouter.post('/create-order',updateAccessToken,isAuthenticated,createOrder);

orderRouter.get('/get-order-admin',updateAccessToken,isAuthenticated,authorizeRoles("admin"),getAllOrderService);

orderRouter.post("/payment",isAuthenticated,newPayment);

orderRouter.get("/payment/stripepublishablekey",sendStripePublishableKey);

export default orderRouter