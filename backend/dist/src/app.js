"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const prisma_1 = __importDefault(require("./lib/prisma"));
const router_1 = __importDefault(require("./routes/router"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use('/api', router_1.default);
// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        await prisma_1.default.$queryRaw `SELECT 1`;
        res.status(200).json({ status: 'success', message: 'Database Connected' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
});
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello Hrithik! Your App is ready.' });
});
