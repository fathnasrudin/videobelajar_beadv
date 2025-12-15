import z from "zod";

export const emailVerificationSchema = z.object({
  id: z.string(),
  tokenHash: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  usedAt: z.coerce.date().nullable(),
  expiresAt: z.coerce.date(),
});

export type EmailVerification = z.infer<typeof emailVerificationSchema>;
