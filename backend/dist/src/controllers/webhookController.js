"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhook = void 0;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const webhook = async (req, res) => {
    const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const shasum = crypto_1.default.createHmac('sha256', WEBHOOK_SECRET);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    if (signature === digest) {
        const event = req.body.event;
        if (event === 'payment.captured') {
            const payment = req.body.payload.payment.entity;
            const orderId = payment.order_id;
            await prisma_1.default.transaction.update({
                where: {
                    razorpayOrderId: orderId,
                },
                data: {
                    amount: payment.amount,
                    razorpayOrderId: orderId,
                    razorpayPaymentId: payment.id,
                    razorpaySignature: signature,
                    status: "SUCCESS",
                }
            });
        }
        res.status(200).json({ status: 'ok' });
    }
    else {
        res.status(400).send('Invalid signature');
    }
};
exports.webhook = webhook;
