import express from 'express';
import prisma from '../lib/prisma';
import { verifyAccessRefreshToken, generateTokens } from '../utils/jwt';

export const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    // const refreshToken = req.headers.refreshtoken;
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header is required' });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = verifyAccessRefreshToken(token, "access") as any;

        await prisma.user.findUnique({ where: { id: decodedToken.id } });
        (req as any).userId = decodedToken.id;
        next();

    } catch (error) {
        console.log("PS=>", error);
        return res.status(401).json({ error: 'Failed to authenticate user' });
    }
}