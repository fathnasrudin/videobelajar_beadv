import { Request, Response, Router, Router as RouterType } from "express";
import { createCourseSchema } from "./course.schema";

interface Course {
  id: string;
  title: string;
  description?: string | undefined;
}

const courses: Course[] = [
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

const router: RouterType = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    ok: true,
    message: "Success",
    data: courses,
    error: null,
  });
});

router.post("/", async (req: Request, res: Response) => {
  const body = req.body;

  //validate and sanitize
  const data = await createCourseSchema.parseAsync(body);

  // create course
  const newCourse: Course = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description,
  };
  courses.push(newCourse);

  res.json({
    ok: true,
    message: "Success",
    data: newCourse,
    error: null,
  });
});

export const courseRouter = router;
