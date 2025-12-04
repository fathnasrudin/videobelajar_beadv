import { Request, Response, Router, Router as RouterType } from "express";
import {
  Course,
  createCourseSchema,
  updateCourseSchema,
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
    ...data,
  };
  courses.push(newCourse);

  res.json({
    ok: true,
    message: "Success",
    data: newCourse,
    error: null,
  });
});

router.patch("/:id", async (req: Request, res: Response) => {
  const body = req.body;
  const courseId = req.params.id;

  //validate and sanitize
  const data = await updateCourseSchema.parseAsync(body);

  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    res.status(404).json({
      ok: false,
      message: `course with id: "${courseId}" not found`,
      data: null,
      error: {
        message: `course with id: "${courseId}" not found`,
      },
    });
    return;
  }

  const updatedCourse: Course = {
    ...course,
    description: data.description,
    title: data.title ? data.title : course.title,
  };
  courses = courses.map((c) => {
    if (c.id === courseId) {
      c = updatedCourse;
    }
    return c;
  });

  res.json({
    ok: true,
    message: "Success",
    data: updatedCourse,
    error: null,
  });
});

router.delete("/:id", async (req: Request, res: Response) => {
  const courseId = req.params.id;

  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    res.status(404).json({
      ok: false,
      message: `course with id: "${courseId}" not found`,
      data: null,
      error: {
        message: `course with id: "${courseId}" not found`,
      },
    });
    return;
  }

  courses = courses.filter((c) => c.id !== courseId);

  res.json({
    ok: true,
    message: "success",
    data: {
      id: course.id,
    },
    error: null,
  });
});
export const courseRouter = router;
