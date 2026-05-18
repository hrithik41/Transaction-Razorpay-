import prisma from "../lib/prisma";
import { Request, Response } from "express";
import { razorpay } from "../utils/razorpay";

export const getOrderHistory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const transactions = await prisma.transaction.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch order history" });
    }
};

export const markPaymentFailed = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;

        await prisma.transaction.update({
            where: { razorpayOrderId: orderId },
            data: { status: "FAILED" }
        });

        res.status(200).json({ message: "Payment marked as failed" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update payment status" });
    }
};

export const refundPayment = async (req: Request, res: Response) => {
    console.log("refund controller hit")
    try {
        const { orderId } = req.body;

        const transaction = await prisma.transaction.findUnique({
            where: { razorpayOrderId: orderId } as any,
        });

        if (!transaction || !transaction.razorpayPaymentId) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        if (transaction.status === "REFUNDED" || transaction.status === "FAILED") {
            return res.status(400).json({ error: "Transaction already refunded or failed" });
        }

        const refund = await razorpay.payments.refund(transaction.razorpayPaymentId, {
            amount: transaction.amount * 100,
            notes: {
                "reason": "user requested refund",
            }
        });
        console.log("refund : ", refund);

        console.log("Refunded");

        await prisma.transaction.update({
            where: { razorpayOrderId: orderId },
            data: { status: "REFUNDED", reason: "user requested refund" }
        });

        res.status(200).json({ message: "Payment marked as refunded" });
    } catch (error) {
        console.log("Here is the error : ", error);
        res.status(500).json({ error: "Failed to update payment status" });
    }
}
