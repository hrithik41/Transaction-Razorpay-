"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const dashboardController_1 = __importDefault(require("../controllers/dashboardController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const createOrder_1 = require("../controllers/createOrder");
const verifyPayment_1 = require("../controllers/verifyPayment");
const productController = __importStar(require("../controllers/productController"));
const webhookController_1 = require("../controllers/webhookController");
const cartController = __importStar(require("../controllers/cartController"));
const transactionController_1 = require("../controllers/transactionController");
const router = express_1.default.Router();
router.post('/register', authController_1.default.register);
router.post('/login', authController_1.default.login);
router.post('/refresh-token', authController_1.default.refreshAccessToken);
router.post('/dashboard', authMiddleware_1.authMiddleware, dashboardController_1.default);
router.post('/create-order', authMiddleware_1.authMiddleware, createOrder_1.createOrder);
router.post('/verify-payment', authMiddleware_1.authMiddleware, verifyPayment_1.verifyPayment);
router.post('/products', authMiddleware_1.authMiddleware, productController.getProducts);
router.post('/webhook', webhookController_1.webhook);
router.get('/orders/history', authMiddleware_1.authMiddleware, transactionController_1.getOrderHistory);
router.post('/payment-failed', authMiddleware_1.authMiddleware, transactionController_1.markPaymentFailed);
router.post('/cart/add', authMiddleware_1.authMiddleware, cartController.addToCart);
router.get('/cart/get', authMiddleware_1.authMiddleware, cartController.getCart);
router.put('/cart/remove', authMiddleware_1.authMiddleware, cartController.removeFromCart);
router.delete('/cart/clear', authMiddleware_1.authMiddleware, cartController.clearCart);
router.post('/cart/checkout', authMiddleware_1.authMiddleware, cartController.checkoutCart);
exports.default = router;
