import prisma from "../lib/prisma";
import { Request, Response } from "express";

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
