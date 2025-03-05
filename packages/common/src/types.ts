import {z} from 'zod';


export const CreateUserSchema = z.object({
     email: z.string().min(3).max(20),
    password:z.string().min(6).max(100),
    name:z.string().min(3).max(100),
});


export const SigninSchema = z.object({
    email: z.string().min(3).max(20),
    password:z.string().min(6).max(100),
});

export const CreateRoomSchema = z.object({
    slug: z.string().min(3).max(100),
});


