import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma';

export const webhook = async (req: Request, res: Response) => {
    console.log("Webhook Here!!!")

    const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    
    const shasum = crypto.createHmac('sha256', WEBHOOK_SECRET!);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    if (signature === digest) {
        const event = req.body.event;

        if (event === 'payment.captured') {
            const payment = req.body.payload.payment.entity;
            const orderId = payment.order_id;

            await prisma.transaction.update({
                where: {
                    razorpayOrderId: orderId,
                },
                data: {
                    amount: payment.amount / 100,
                    razorpayOrderId: orderId,
                    razorpayPaymentId: payment.id,
                    razorpaySignature: signature as string,
                    status: "SUCCESS",
                }
            });

        }

        res.status(200).json({ status: 'ok' });
    } else {
        res.status(400).send('Invalid signature');
    }
};