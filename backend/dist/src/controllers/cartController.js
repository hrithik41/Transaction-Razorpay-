"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutCart = exports.clearCart = exports.removeFromCart = exports.getCart = exports.addToCart = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const razorpay_1 = require("../utils/razorpay");
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.userId;
        const product = await prisma_1.default.product.findUnique({ where: { product_id: productId } });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        const existingItem = await prisma_1.default.cart.findUnique({
            where: {
                fk_user_id_fk_product_id: {
                    fk_user_id: userId,
                    fk_product_id: productId
                }
            }
        });
        if (existingItem) {
            const updatedItem = await prisma_1.default.cart.update({
                where: { cart_id: existingItem.cart_id },
                data: { cart_quantity: existingItem.cart_quantity + quantity, cart_amount: (existingItem.cart_quantity + quantity) * product.discount_price }
            });
            return res.status(200).json({ message: "Quantity updated", cart: updatedItem });
        }
        const newItem = await prisma_1.default.cart.create({
            data: {
                fk_user_id: userId,
                fk_product_id: productId,
                cart_quantity: quantity,
                cart_amount: quantity * product.discount_price,
                is_cart_cleared: false
            }
        });
        res.status(201).json({ message: "Added to cart", cart: newItem });
    }
    catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ error: "Failed to add to cart" });
    }
};
exports.addToCart = addToCart;
const getCart = async (req, res) => {
    try {
        const userId = req.userId;
        const cartItems = await prisma_1.default.cart.findMany({
            where: { fk_user_id: userId },
            include: {
                product: true
            }
        });
        res.status(200).json({ cart: cartItems });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch cart" });
    }
};
exports.getCart = getCart;
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;
        const existingItem = await prisma_1.default.cart.findUnique({
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
        await prisma_1.default.cart.delete({
            where: { cart_id: existingItem.cart_id }
        });
        res.status(200).json({ message: "Item removed" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to remove item" });
    }
};
exports.removeFromCart = removeFromCart;
const clearCart = async (req, res) => {
    try {
        const userId = req.userId;
        await prisma_1.default.cart.deleteMany({
            where: {
                fk_user_id: userId,
            }
        });
        res.status(200).json({ message: "Cart cleared" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to clear cart" });
    }
};
exports.clearCart = clearCart;
const checkoutCart = async (req, res) => {
    try {
        const userId = req.userId;
        const cartItems = await prisma_1.default.cart.findMany({
            where: { fk_user_id: userId, is_cart_cleared: false },
            include: {
                product: true
            }
        });
        if (cartItems.length === 0) {
            return res.status(404).json({ error: "Cart is empty" });
        }
        const totalAmount = cartItems.reduce((acc, item) => acc + (item.product.discount_price * item.cart_quantity), 0);
        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `cart_receipt_${Date.now()}`,
        };
        const order = await razorpay_1.razorpay.orders.create(options);
        await prisma_1.default.transaction.create({
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
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch cart" });
    }
};
exports.checkoutCart = checkoutCart;
