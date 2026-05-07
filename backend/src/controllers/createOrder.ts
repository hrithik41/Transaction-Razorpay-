import { razorpay } from "../utils/razorpay";
import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { productId } = req.body;
        const product = await prisma.product.findUnique({
            where: {
                product_id: productId
            }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const amount = product.discount_price;

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `rcpt_${productId}_${Date.now()}`,
        });

        await prisma.transaction.create({
            data: {
                razorpayOrderId: order.id,
                provider: "RAZORPAY",
                amount: amount,
                status: 'PENDING',
                userId: userId,
            }
        });

        res.json(order);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Order creation failed" });
    }
};