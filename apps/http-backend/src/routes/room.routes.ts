
import { Router } from 'express';
import roomController from '../controllers/room.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/:roomId/chats', authMiddleware, roomController.getChats);
router.post('/:roomId/chat', authMiddleware, roomController.createChat);

export default router;