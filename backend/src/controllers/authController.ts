import express from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import { verifyAccessRefreshToken, generateTokens } from '../utils/jwt';

// User Created
const register = async (req: express.Request, res: express.Response) => {
    console.log("Registering");
    try {

        const { name, email, password } = req.body;
        console.log(req.body);
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hash,
                updatedAt: new Date(),
                createdAt: new Date(),
            }
        });

        console.log(newUser);

        const [accessToken, refreshToken] = generateTokens(newUser.id);

        return res.status(201).json({ message: "User Created", newUser, accessToken, refreshToken });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to create user' });
    }
};

const login = async (req: express.Request, res: express.Response) => {
    console.log("Login");
    try {
        const { email, password } = req.body;
        console.log(req.body);

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        console.log(user)

        const [accessToken, refreshToken] = generateTokens(user.id);
        return res.status(200).json({ message: "User Logged In", user, accessToken, refreshToken });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to login' });
    }
};

const refreshAccessToken = (req: express.Request, res: express.Response) => {
    console.log("Refreshing Access Token");
    try {
        const refreshtoken = req.headers.refreshtoken;
        if (!refreshtoken) {
            return res.status(401).json({ error: 'Refresh token is required' });
        }


        const decodedToken = verifyAccessRefreshToken(refreshtoken, "refresh") as any;

        const [newAccessToken, newRefreshToken] = generateTokens(decodedToken.id);

        return res.status(200).json({ message: "Access Token Refreshed", accessToken: newAccessToken, refreshToken: newRefreshToken });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to refresh access token' });
    }
};

export default { register, login, refreshAccessToken };