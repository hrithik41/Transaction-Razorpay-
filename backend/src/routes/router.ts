import express from 'express';
import authController from '../controllers/authController';
import dashboard from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/authMiddleware';
import { createOrder } from '../controllers/createOrder';
import { verifyPayment } from '../controllers/verifyPayment';
import * as productController from '../controllers/productController';
import { webhook } from '../controllers/webhookController';
import * as cartController from '../controllers/cartController';
import { getOrderHistory } from '../controllers/transactionController';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshAccessToken);
router.post('/dashboard', authMiddleware, dashboard);
router.post('/create-order', authMiddleware, createOrder);
router.post('/verify-payment', authMiddleware, verifyPayment);
router.post('/products', authMiddleware, productController.getProducts);
router.post('/webhook', webhook);
router.get('/orders/history', authMiddleware, getOrderHistory);

router.post('/cart/add', authMiddleware, cartController.addToCart);
router.get('/cart/get', authMiddleware, cartController.getCart);
router.put('/cart/remove', authMiddleware, cartController.removeFromCart);
router.delete('/cart/clear', authMiddleware, cartController.clearCart);
router.post('/cart/checkout', authMiddleware, cartController.checkoutCart);

export default router;