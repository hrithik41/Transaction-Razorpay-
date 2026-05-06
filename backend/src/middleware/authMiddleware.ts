import express from 'express';
import jwt from "jsonwebtoken";
import prisma from '../lib/prisma';
import { verifyAccessRefreshToken, generateTokens } from '../utils/jwt';

export const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Auth Middleware");

    // const refreshToken = req.headers.refreshtoken;
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header is required' });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = verifyAccessRefreshToken(token, "access") as any;
        console.log("Decoded Token: ", decodedToken);

        const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });
        console.log(user);
        (req as any).userId = decodedToken.id;
        next();


        // if (!user) {
        //     return res.status(404).json({ error: 'User not found' });
        // }
        

        
        // next();
    } catch (error) {
        console.log("PS=>", error);
        // if (error instanceof jwt.TokenExpiredError) {
        //     if (!refreshToken) {
        //         return res.status(401).json({ error: 'Access token expired and no refresh token provided' });
        //     }

        //     try {
        //         const decodedRefreshToken = verifyAccessRefreshToken(refreshToken as string, "refresh") as any;

        //         console.log("Decoded Refresh Token: ", decodedRefreshToken);

        //         const [newAccessToken, newRefreshToken] = generateTokens(decodedRefreshToken.id);

        //         console.log("New Access Token: ", newAccessToken);
        //         console.log("New Refresh Token: ", newRefreshToken);

        //         return res.status(200).json({
        //             message: "Access Token Refreshed",
        //             newAccessToken,
        //             newRefreshToken
        //         });
        //     } catch (refreshError) {
        //         console.log("Refresh Token Error:", refreshError);
        //         return res.status(401).json({ error: 'Session expired, please login again' });
        //     }
        // }
        return res.status(401).json({ error: 'Failed to authenticate user' });
    }
}