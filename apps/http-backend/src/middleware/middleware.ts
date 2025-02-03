import { NextFunction, Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

interface JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

export const authMiddleware: RequestHandler = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            res.status(401).json({ message: "No token provided" });
            return;
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : authHeader;

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
        return;
    }
}
