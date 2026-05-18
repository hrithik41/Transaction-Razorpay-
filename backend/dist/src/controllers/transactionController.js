"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPayment = exports.markPaymentFailed = exports.getOrderHistory = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const razorpay_1 = require("../utils/razorpay");
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
const refundPayment = async (req, res) => {
    console.log("refund controller hit");
    try {
        const { orderId } = req.body;
        const transaction = await prisma_1.default.transaction.findUnique({
            where: { razorpayOrderId: orderId },
        });
        if (!transaction || !transaction.razorpayPaymentId) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        if (transaction.status === "REFUNDED" || transaction.status === "FAILED") {
            return res.status(400).json({ error: "Transaction already refunded or failed" });
        }
        const refund = await razorpay_1.razorpay.payments.refund(transaction.razorpayPaymentId, {
            amount: transaction.amount * 100,
            notes: {
                "reason": "user requested refund",
            }
        });
        console.log("refund : ", refund);
        console.log("Refunded");
        await prisma_1.default.transaction.update({
            where: { razorpayOrderId: orderId },
            data: { status: "REFUNDED", reason: "user requested refund" }
        });
        res.status(200).json({ message: "Payment marked as refunded" });
    }
    catch (error) {
        console.log("Here is the error : ", error);
        res.status(500).json({ error: "Failed to update payment status" });
    }
};
exports.refundPayment = refundPayment;
