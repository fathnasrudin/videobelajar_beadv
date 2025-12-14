import z from "zod";

export const refreshTokenSchema = z.object({
  id: z.string(),
  userId: z.string(),
  secretHash: z.string(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
  revokedAt: z.coerce.date().nullable(),
});

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
