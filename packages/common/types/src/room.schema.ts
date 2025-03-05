import { z } from 'zod';

export const CreateRoomSchema = z.object({
    slug: z.string().min(1).max(50)
});

export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;
