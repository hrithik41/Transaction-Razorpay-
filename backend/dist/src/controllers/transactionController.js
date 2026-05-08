"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markPaymentFailed = exports.getOrderHistory = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getOrderHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const transactions = await prisma_1.default.transaction.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ transactions });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch order history" });
    }
};
exports.getOrderHistory = getOrderHistory;
const markPaymentFailed = async (req, res) => {
    try {
        const { orderId } = req.body;
        await prisma_1.default.transaction.update({
            where: { razorpayOrderId: orderId },
            data: { status: "FAILED" }
        });
        res.status(200).json({ message: "Payment marked as failed" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update payment status" });
    }
};
exports.markPaymentFailed = markPaymentFailed;
