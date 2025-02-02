import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export function middleware(req:Request, res:Response, next:NextFunction){ 
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).send("Unauthorized");
    }
    try {
        const payload = jwt.verify(token, "secret");
        console.log(payload);
        next();
    } catch (error) {
        return res.status(401).send("Unauthorized");
    }

}