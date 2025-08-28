import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import { createOrder, getAllOrderService } from '../controllers/order.controller';

const orderRouter = express.Router();

orderRouter.post('/create-order', isAuthenticated,createOrder);

orderRouter.get('/get-order-admin', isAuthenticated,authorizeRoles("admin"),getAllOrderService);


export default orderRouter