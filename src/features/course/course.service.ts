import { RowDataPacket } from "mysql2";
import { db } from "../../lib/db";
import {
  Course,
  CreateCourseInputSchema,
  UpdateCourseInputSchema,
} from "./course.schema";

let courses: Course[] = [
  {
    id: "c1",
    title: "Dasar Pemrograman JavaScript",
    description: "Memahami variabel, tipe data, dan control flow.",
  },
  {
    id: "c2",
    title: "Fundamental TypeScript",
    description: "Belajar static typing, interface, dan generics.",
  },
  {
    id: "c3",
    title: "Database MySQL untuk Backend",
    description: "DDL, DML, indexing, dan basic query optimization.",
  },
  {
    id: "c4",
    title: "Pemrograman Backend dengan Express",
    description: "Routing, middleware, error handling, dan struktur folder.",
  },
  {
    id: "c5",
    title: "Dasar React untuk Frontend",
    description: "Component, state, props, dan rendering.",
  },
];

interface CourseDB extends Course, RowDataPacket {}

export async function getCourses(): Promise<Course[]> {
  const [rows] = await db.query<CourseDB[]>("SELECT * from courses");
  return rows;
}

export async function createCourse(data: CreateCourseInputSchema) {
  const [rows] = await db.execute(
    "INSERT INTO courses (title, description) VALUES (?, ?)",
    [data.title, data.description ? data.description : null]
  );
  return rows;
}

export async function getCourseById(id: Course["id"]): Promise<Course> {
  const [[course]] = await db.execute<CourseDB[]>(
    `SELECT 
     c.id, c.title, c.description, 
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', cat.id, 
          'name', cat.name
          )
      ) as categories 
    FROM courses c
    LEFT JOIN courses_categories cc on cc.course_id = c.id
    LEFT JOIN categories cat ON cat.id = cc.category_id
    WHERE c.id = ? 
    GROUP BY c.id;
    `,
    [id]
  );

  // @todo should fetch categories for the course
  // const thisCourseCategories =

  if (!course) {
    throw new Error(`Course with id: "${id}" not found`);
  }

  return course;
}

export async function updateCourseById(
  id: Course["id"],
  data: UpdateCourseInputSchema
) {
  const fields: string[] = [];
  const values = [];

  Object.entries(data).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) return Promise.resolve();

  values.push(id);
  const [rows] = await db.execute(
    `UPDATE courses SET ${fields.join(",")}  WHERE id = ?`,
    values
  );
  return rows;
}

export async function deleteCourseById(id: Course["id"]) {
  const [rows] = await db.execute("DELETE FROM courses WHERE id = ?", [id]);
  return rows;
}
