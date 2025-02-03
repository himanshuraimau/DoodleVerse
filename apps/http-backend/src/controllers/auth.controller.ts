import { Request, Response, RequestHandler } from 'express';
import { CreateUserSchema, SigninSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';

export class AuthController {
    public signup: RequestHandler = async (req, res): Promise<void> => {
        const parsedData = CreateUserSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({ message: "Invalid input data", errors: parsedData.error.issues });
            return;
        }

        try {
            const user = await prismaClient.user.create({
                data: {
                    email: parsedData.data.email.toLowerCase().trim(),
                    password: parsedData.data.password,
                    name: parsedData.data.name.trim()
                }
            });
            res.json({ userId: user.id });
        } catch (error) {
            if ((error as any).code === 'P2002') {
                res.status(409).json({ message: "Email already exists" });
                return;
            }
            console.error('Signup error:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public signin: RequestHandler = async (req, res): Promise<void> => {
        const parsedData = SigninSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({ message: "Invalid input data", errors: parsedData.error.issues });
            return;
        }

        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    email: parsedData.data.email.toLowerCase().trim(),
                    password: parsedData.data.password
                }
            });

            if (!user) {
                res.status(401).json({ message: "Invalid email or password" });
                return;
            }

            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ token });
        } catch (error) {
            console.error('Signin error:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
