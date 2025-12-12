import z from "zod";

export const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const createCategorySchema = categorySchema.pick({
  name: true,
});

export const updateCategorySchema = createCategorySchema.partial();

export type Category = z.infer<typeof categorySchema>;
export type CreateCategoryInputSchema = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInputSchema = z.infer<typeof updateCategorySchema>;
