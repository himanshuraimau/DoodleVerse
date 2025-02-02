import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req:Request, res:Response, next:NextFunction){ 
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).send("Unauthorized");
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        console.log(payload);
        next();
    } catch (error) {
        return res.status(401).send("Unauthorized");
    }

}