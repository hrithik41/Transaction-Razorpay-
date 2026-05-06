import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getProducts = async (req: Request, res: Response) => {
    try {
        // Fetch all products that are marked as AVAILABLE
        const products = await prisma.product.findMany({
            where: {
                product_status: 'AVAILABLE'
            }
        });

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error("Fetch Products Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};
