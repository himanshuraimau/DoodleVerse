import express from 'express';
import { middleware } from './middleware';
import { JWT_SECRET } from '@repo/backend-common/config';
import jwt from 'jsonwebtoken';
import { CreateUserSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';

const app = express();




app.post('/signup', async (req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json(parsedData.error);
        return;
    }

   try {
     await prismaClient.user.create({
         data: {
             email: parsedData.data?.email,
             password: parsedData.data.password,
             name: parsedData.data.name
         }
     })
   } catch (error) {
       res.status(500).json({
           error: "Something went wrong"
       });
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