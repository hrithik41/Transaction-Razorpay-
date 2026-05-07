import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { razorpay } from '../utils/razorpay';

export const addToCart = async (req: Request, res: Response) => {
    try {
        const { productId, quantity } = req.body;
        const userId = (req as any).userId;

        const product = await prisma.product.findUnique({ where: { product_id: productId } });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const existingItem = await prisma.cart.findUnique({
            where: {
                fk_user_id_fk_product_id: {
                    fk_user_id: userId,
                    fk_product_id: productId
                }
            }
        });

        if (existingItem) {
            const updatedItem = await prisma.cart.update({
                where: { cart_id: existingItem.cart_id },
                data: { cart_quantity: existingItem.cart_quantity + quantity, cart_amount: (existingItem.cart_quantity + quantity) * product.discount_price }
            });
            return res.status(200).json({ message: "Quantity updated", cart: updatedItem });
        }

        const newItem = await prisma.cart.create({
            data: {
                fk_user_id: userId,
                fk_product_id: productId,
                cart_quantity: quantity,
                cart_amount: quantity * product.discount_price,
                is_cart_cleared: false
            }
        });

        res.status(201).json({ message: "Added to cart", cart: newItem });

    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ error: "Failed to add to cart" });
    }
};

export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const cartItems = await prisma.cart.findMany({
            where: { fk_user_id: userId },
            include: {
                product: true
            }
        });
        res.status(200).json({ cart: cartItems });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cart" });
    }
};

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body;
        const userId = (req as any).userId;
        const existingItem = await prisma.cart.findUnique({
            where: {
                fk_user_id_fk_product_id: {
                    fk_user_id: userId,
                    fk_product_id: productId
                }
            }
        });
        if (!existingItem) {
            return res.status(404).json({ error: "Item not found" });
        }
        await prisma.cart.delete({
            where: { cart_id: existingItem.cart_id }
        });
        res.status(200).json({ message: "Item removed" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove item" });
    }
};

export const clearCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        await prisma.cart.updateMany({
            where: {
                fk_user_id: userId,
            },
            data: {
                is_cart_cleared: true
            }
        });
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ error: "Failed to clear cart" });
    }
};

export const checkoutCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const cartItems = await prisma.cart.findMany({
            where: { fk_user_id: userId, is_cart_cleared: false },
            include: {
                product: true
            }
        });

        if (cartItems.length === 0) {
            return res.status(404).json({ error: "Cart is empty" });
        }

        const totalAmount = cartItems.reduce((acc: number, item: any) => acc + (item.product.discount_price * item.cart_quantity), 0);

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `cart_receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        await prisma.transaction.create({
            data: {
                amount: totalAmount,
                razorpayOrderId: order.id,
                razorpayPaymentId: null,
                razorpaySignature: null,
                userId: userId,
                status: "PENDING",
                provider: "RAZORPAY",
            }
        });

        res.status(200).json({ cart: cartItems, totalAmount, order });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cart" });
    }
};