import {z} from 'zod'

export const messageSchema = z.object({
    content: z.string()
    .min(10, {message: "Conetent must be of atleast 10 character"})
    .max(300, {message: "Conetent must be no longer than 300 character"})
})