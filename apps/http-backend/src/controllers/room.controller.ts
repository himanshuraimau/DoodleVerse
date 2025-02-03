import { Request, Response } from 'express';
import { CreateRoomSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';

class RoomController {
    async createRoom(req: Request, res: Response) {
        const parsedData = CreateRoomSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({ message: "Invalid input data" });
            return;
        }

        const userId = req.userId;
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        try {
            const room = await prismaClient.room.create({
                data: {
                    slug: parsedData.data.name,
                    adminId: userId
                }
            });
            return res.json({ roomId: room.id });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }

    async getChats(req: Request, res: Response) {
        const roomId = req.params.roomId;
        if (!roomId) {
            res.status(400).json({ message: "Room ID is required" });
            return;
        }

        try {
            const chats = await prismaClient.chat.findMany({
                where: {
                    roomId: Number(roomId)
                },
                orderBy:{
                    id: 'desc'
                },
                take:50
            });
            res.json({ messages: chats });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }
}

export default new RoomController();