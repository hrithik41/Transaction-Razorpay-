"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
// User Created
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hash = await bcrypt_1.default.hash(password, 10);
        const newUser = await prisma_1.default.user.create({
            data: {
                name: name,
                email: email,
                password: hash,
                updatedAt: new Date(),
                createdAt: new Date(),
            }
        });
        const [accessToken, refreshToken] = (0, jwt_1.generateTokens)(newUser.id);
        return res.status(201).json({ message: "User Created", newUser, accessToken, refreshToken });
    }
    catch (error) {
        console.error("Registration error details:", error);
        return res.status(500).json({ error: 'Failed to create user', details: error instanceof Error ? error.message : "Unknown error" });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        const [accessToken, refreshToken] = (0, jwt_1.generateTokens)(user.id);
        return res.status(200).json({ message: "User Logged In", user, accessToken, refreshToken });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to login' });
    }
};
const refreshAccessToken = (req, res) => {
    try {
        const refreshtoken = req.headers.refreshtoken;
        if (!refreshtoken) {
            return res.status(401).json({ error: 'Refresh token is required' });
        }
        const decodedToken = (0, jwt_1.verifyAccessRefreshToken)(refreshtoken, "refresh");
        const [newAccessToken, newRefreshToken] = (0, jwt_1.generateTokens)(decodedToken.id);
        return res.status(200).json({ message: "Access Token Refreshed", accessToken: newAccessToken, refreshToken: newRefreshToken });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to refresh access token' });
    }
};
exports.default = { register, login, refreshAccessToken };
