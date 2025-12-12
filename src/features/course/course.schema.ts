import z from "zod";
import { categorySchema } from "../category/category.schema";

export const courseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable(),
  category: z.array(categorySchema).optional(),
});

export const createCourseSchema = courseSchema.pick({
  title: true,
  description: true,
});

export const updateCourseSchema = createCourseSchema.partial();

export type Course = z.infer<typeof courseSchema>;
export type CreateCourseInputSchema = z.infer<typeof createCourseSchema>;
export type UpdateCourseInputSchema = z.infer<typeof updateCourseSchema>;
