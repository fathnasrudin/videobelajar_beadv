import z from "zod";

export const uploadSignatureSchema = z.object({
  ownerId: z.string().min(1),
  ownerType: z.enum(["COURSE"]),
  assetRole: z.enum(["THUMBNAIL"]),
});

export const uploadSaveSchema = z.object({
  ownerId: z.string().min(1),
  ownerType: z.enum(["COURSE"]),
  assetRole: z.enum(["THUMBNAIL"]),
  publicId: z.string().min(1),
});

export type UploadSignatureInputSchema = z.infer<typeof uploadSignatureSchema>;
export type UploadSaveInputSchema = z.infer<typeof uploadSaveSchema>;
