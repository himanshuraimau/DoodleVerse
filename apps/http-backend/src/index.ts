import express from 'express';
import { middleware } from './middleware';
import { JWT_SECRET } from '@repo/backend-common/config';
import jwt from 'jsonwebtoken';
import { CreateUserSchema } from '@repo/common/types';

const app = express();




app.post('/signup', (req, res) => {

    const data = CreateUserSchema.safeParse(req.body);
    
    if(!data.success){
        res.status(400).json(data.error);
        return;
    }


    res.json({
        userId: "123"
    })
});

app.post('/signin', (req, res) => {

    const userId = "123";

    const token = jwt.sign({
        userId
    }, JWT_SECRET);
    res.json({
        token
    });
});

app.post("/room", middleware as express.RequestHandler, (req, res) => {
    res.json({
        roomId: "123"
    })
})




app.listen(3001, () => {
    console.log('Server is running on http://localhost:3000');
});