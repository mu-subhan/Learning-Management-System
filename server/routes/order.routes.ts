import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import { createOrder, getAllOrderService } from '../controllers/order.controller';
import { updateAccessToken } from '../controllers/user.controller';

const orderRouter = express.Router();

orderRouter.post('/create-order',updateAccessToken,isAuthenticated,createOrder);

orderRouter.get('/get-order-admin',updateAccessToken,isAuthenticated,authorizeRoles("admin"),getAllOrderService);


export default orderRouter