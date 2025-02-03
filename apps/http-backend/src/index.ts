import express, { Request } from 'express';
import { middleware } from './middleware';
import { JWT_SECRET } from '@repo/backend-common/config';
import jwt from 'jsonwebtoken';
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';

const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({
            message: "Invalid input data"
        });
        return;
    }

    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.email,
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        });

        res.json({
            userId: user.id
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error"
        });
        return;
    }
});

app.post('/signin', async (req, res) => {

    const parsedData = SigninSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({
            message: "Invalid input data"
        });
        return;
    }

    try {
        const user = await prismaClient.user.findFirst({
            where: {
                email: parsedData.data.email,
                password: parsedData.data.password
            }
        });

        if (!user) {
            res.status(401).json({
                message: "Invalid email or password"
            });
            return;
        }

        const token = jwt.sign({
           userId: user?.id
        }, JWT_SECRET);

        res.json({
            token
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error"
        });
        return;
    }
});



app.post("/room", middleware as express.RequestHandler, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({
            message: "Invalid input data"
        });
        return;
    }
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({
            message: "User ID is required"
        });
        return;
    }
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        });
        res.json({
            roomId: room.id
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error"
        });
        return;
    }
});

app.get


app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});