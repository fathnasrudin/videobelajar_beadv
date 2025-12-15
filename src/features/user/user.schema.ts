import z from "zod";

export const userSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
  username: z.string().min(1),
  password: z.string().min(1),
  fullname: z.string().min(1),
  isVerified: z.boolean().default(false),
  verifiedAt: z.coerce.date().nullable(),
});

export type User = z.infer<typeof userSchema>;
