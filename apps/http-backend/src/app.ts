import express, { NextFunction, Request, Response } from 'express';
import { authRouter } from './routes/auth.route';
import { roomRouter } from './routes/room.route';
import cors from 'cors';

const app: express.Application = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/room', roomRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

export { app };
