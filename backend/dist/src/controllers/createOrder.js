"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const razorpay_1 = require("../utils/razorpay");
const prisma_1 = __importDefault(require("../lib/prisma"));
const createOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.body;
        const product = await prisma_1.default.product.findUnique({
            where: {
                product_id: productId
            }
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const amount = product.discount_price;
        const order = await razorpay_1.razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `rcpt_${productId}_${Date.now()}`,
        });
        await prisma_1.default.transaction.create({
            data: {
                razorpayOrderId: order.id,
                provider: "RAZORPAY",
                amount: amount,
                status: 'PENDING',
                userId: userId,
            }
        });
        res.json(order);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Order creation failed" });
    }
};
exports.createOrder = createOrder;
