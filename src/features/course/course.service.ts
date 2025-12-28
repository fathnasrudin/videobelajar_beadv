import { RowDataPacket } from "mysql2";
import {
  Course,
  CourseQueryParamsSchema,
  CreateCourseInputSchema,
  UpdateCourseInputSchema,
} from "./course.schema";
import { prisma } from "../../lib/prisma";
import { coursesWhereInput } from "../../generated/prisma/models";
import { buildCloudinaryUrl } from "../../lib/cloudinary";
import { assetRepo } from "../upload/asset.repo";

// interface CourseDB extends Course, RowDataPacket {}

export async function getCourses(
  queryParams: CourseQueryParamsSchema
): Promise<Course[]> {
  const and: coursesWhereInput["AND"] = [];

  // search filter
  if (queryParams.search) {
    and.push({ title: { contains: queryParams.search } });
  }

  // categories filter
  if (queryParams.categories) {
    and.push({
      courses_categories: {
        some: {
          category_id: {
            in: queryParams.categories,
          },
        },
      },
    });
  }

  // price filter
  if (queryParams.priceMin) {
    and.push({
      price: {
        gte: queryParams.priceMin || 0,
      },
    });
  }

  // price
  if (queryParams.priceMax) {
    and.push({
      price: {
        lte: queryParams.priceMax,
      },
    });
  }

  const orderBy = queryParams.sort.map((s) => ({
    [s.field]: s.direction,
  }));

  let courses = await prisma.courses.findMany({
    where: { AND: and },
    include: {
      thumbnail: { select: { publicId: true } },
    },
    orderBy,
  });

  const thumbnailedCourses = courses.map((c) => {
    const { thumbnailId, thumbnail, ...filteredC } = c;
    return {
      ...filteredC,
      thumbnailUrl: c.thumbnail?.publicId
        ? buildCloudinaryUrl({ publicId: c.thumbnail.publicId })
        : null,
    };
  });

  return thumbnailedCourses;
}

export async function createCourse(data: CreateCourseInputSchema) {
  return prisma.courses.create({
    data,
  });
}

export async function getCourseById(id: Course["id"]): Promise<Course> {
  const course = await prisma.courses.findUnique({
    where: { id },
    include: {
      courses_categories: {
        omit: { category_id: true, course_id: true },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      thumbnail: { select: { publicId: true } },
    },
  });

  if (!course) {
    throw new Error(`Course with id: "${id}" not found`);
  }

  // darimana dapet url? dari thumbnailPublicId
  // dari mana dapet itu? dari thumbnailId yang nyambung ke asset

  const { courses_categories, thumbnail, thumbnailId, ...filteredC } = course;
  return {
    ...filteredC,
    thumbnailUrl: course.thumbnail?.publicId
      ? buildCloudinaryUrl({ publicId: course.thumbnail.publicId })
      : null,
    categories: course.courses_categories.map((cc) => cc.categories),
  };
}

export async function updateCourseById(
  id: Course["id"],
  data: UpdateCourseInputSchema
) {
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  );

  return prisma.courses.update({ where: { id }, data: filteredData });
}

export async function deleteCourseById(id: Course["id"]) {
  return prisma.courses.delete({ where: { id } });
}
