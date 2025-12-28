import z from "zod";
import { categorySchema } from "../category/category.schema";

export const courseQueryParamsSchema = z.object({
  search: z.string().trim().min(1).max(100).optional(),
  categories: z
    .string()
    .transform((v) => v.split(",").filter(Boolean))
    .optional(),
  sort: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return [];

      return value.split(",").map((item) => {
        const desc = item.startsWith("-");
        const field = desc ? item.slice(1) : item;

        return {
          field: z.enum(["description", "title"]).parse(field),
          direction: desc ? "desc" : "asc",
        };
      });
    }),
  priceMin: z.coerce.number().min(1).optional(),
  priceMax: z.coerce.number().min(1).optional(),
});

export const courseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable(),
  category: z.array(categorySchema).optional(),
  categories: z.array(categorySchema).optional(),
  price: z.coerce.number(),
  thumbnailUrl: z.string().nullable(),
});

export const createCourseSchema = courseSchema.pick({
  title: true,
  description: true,
  price: true,
});

export const updateCourseSchema = createCourseSchema.partial();

export type Course = z.infer<typeof courseSchema>;
export type CreateCourseInputSchema = z.infer<typeof createCourseSchema>;
export type UpdateCourseInputSchema = z.infer<typeof updateCourseSchema>;
export type CourseQueryParamsSchema = z.infer<typeof courseQueryParamsSchema>;
