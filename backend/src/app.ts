import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import prisma from './lib/prisma';
import router from './routes/router';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', router);

app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'success', message: 'Database Connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello Hrithik! Your App is ready.' });
});

export { app };

