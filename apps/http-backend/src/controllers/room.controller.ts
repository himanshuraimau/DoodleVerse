import { Request, Response } from 'express';
import { CreateRoomSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';

class RoomController {
    async createRoom(req: Request, res: Response) {
        const parsedData = CreateRoomSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({ 
                message: "Invalid input data",
                errors: parsedData.error.errors 
            });
        }

        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "User ID is required" });
        }

        try {
            const room = await prismaClient.room.create({
                data: {
                    slug: parsedData.data.slug,
                    adminId: userId
                }
            });
            return res.json({ room });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }
    async getUserRooms(req: Request, res: Response) {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        try {
            const rooms = await prismaClient.room.findMany({
                where: {
                    adminId: userId
                }
            });
            res.json({ rooms });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }

    async getRoom(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: "Slug is required" });
            return;
        }

        try {
            const room = await prismaClient.room.findFirst({
                where: {
                    OR: [
                        { id: Number(id) },
                        { slug: id },
                    ]
                }
            });
            if (!room) {
                res.status(404).json({ message: "Room not found" });
                return;
            }
            res.json({ room });
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
                orderBy: {
                    id: 'asc'
                },
                take: 50
            });
            res.json({ messages: chats });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }

    async joinRoom(req: Request, res: Response) {
        const roomId = req.params.roomId;
        const userId = req.userId;

        if (!roomId) {
            res.status(400).json({ message: "Room ID is required" });
            return;
        }

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        try {
            // Check if the room exists
            const room = await prismaClient.room.findUnique({
                where: {
                    id: Number(roomId)
                }
            });

            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }

            return res.json({ message: "Successfully joined the room" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default new RoomController();