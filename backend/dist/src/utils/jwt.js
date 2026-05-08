"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessRefreshToken = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokens = (id) => {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    const accessExpires = process.env.JWT_ACCESS_EXPIRES_IN;
    const refreshExpires = process.env.JWT_REFRESH_EXPIRES_IN;
    const accessToken = jsonwebtoken_1.default.sign({ id }, accessSecret, { expiresIn: accessExpires });
    const refreshToken = jsonwebtoken_1.default.sign({ id }, refreshSecret, { expiresIn: refreshExpires });
    return [accessToken, refreshToken];
};
exports.generateTokens = generateTokens;
const verifyAccessRefreshToken = (token, type) => {
    const secret = type === "access" ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET;
    let verify = jsonwebtoken_1.default.verify(token, secret);
    return verify;
};
exports.verifyAccessRefreshToken = verifyAccessRefreshToken;
