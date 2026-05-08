"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const crypto_1 = __importDefault(require("crypto"));
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
        const userId = req.userId;
        const hmac = crypto_1.default.createHmac('sha256', process.env.SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');
        const paymentDetails = {
            razorpay_order_id: razorpay_order_id,
            razorpay_payment_id: razorpay_payment_id,
            razorpay_signature: razorpay_signature,
            amount: amount,
            userId: userId
        };
        if (generated_signature === razorpay_signature) {
            await prisma_1.default.transaction.update({
                where: { razorpayOrderId: razorpay_order_id },
                data: {
                    status: "SUCCESS",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                }
            });
            res.json(paymentDetails);
        }
        else {
            console.error("Signature mismatch!");
            return res.status(400).json({ error: 'Payment verification failed' });
        }
    }
    catch (error) {
        console.error('Error verifying payment:', error);
        return res.status(500).json({ error: 'Failed to verify payment' });
    }
};
exports.verifyPayment = verifyPayment;
