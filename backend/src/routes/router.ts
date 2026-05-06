import express from 'express';
import authController from '../controllers/authController';
import dashboard from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/authMiddleware';
import { createOrder } from '../controllers/createOrder';
import { verifyPayment } from '../controllers/verifyPayment';
import * as productController from '../controllers/productController';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshAccessToken);
router.post('/dashboard', authMiddleware, dashboard);
router.post('/create-order', authMiddleware, createOrder);
router.post('/verify-payment', authMiddleware, verifyPayment);
router.post('/products', authMiddleware, productController.getProducts);

export default router;