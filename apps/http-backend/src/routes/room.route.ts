import express, { Request, Response, NextFunction } from 'express';
import RoomController from '../controllers/room.controller';
import { authMiddleware } from '../middleware/middleware';

const router: express.Router = express.Router();

router.post('/', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
    RoomController.createRoom(req, res).catch(next);
});

router.get('/:slug', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
    RoomController.getRoom(req, res).catch(next);
});

router.get('/:roomId/chats', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
    RoomController.getChats(req, res).catch(next);
});

export { router as roomRouter };
