"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getProducts = async (req, res) => {
    try {
        const products = await prisma_1.default.product.findMany({
            where: {
                product_status: 'AVAILABLE'
            }
        });
        res.status(200).json({
            success: true,
            products
        });
    }
    catch (error) {
        console.error("Fetch Products Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};
exports.getProducts = getProducts;
