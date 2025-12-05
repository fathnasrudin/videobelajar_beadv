import { Request, Response, Router, Router as RouterType } from "express";
import {
  Course,
  createCourseSchema,
  updateCourseSchema,
} from "./course.schema";
import * as courseService from "./course.service";

const router: RouterType = Router();

router.get("/", async (req: Request, res: Response) => {
  const courses = await courseService.getCourses();
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
  const status = await courseService.createCourse(data);

  res.json({
    ok: true,
    message: "Success",
    data: status,
    error: null,
  });
});

router.get("/:id", async (req: Request, res: Response) => {
  const courseId = req.params.id;

  if (!courseId) throw new Error("Id not provided");

  const course = await courseService.getCourseById(courseId);

  res.json({
    ok: true,
    message: "success",
    data: course,
    error: null,
  });
});

router.patch("/:id", async (req: Request, res: Response) => {
  const body = req.body;
  const courseId = req.params.id;

  if (!courseId) throw new Error("Id not provided");

  //validate and sanitize
  const data = await updateCourseSchema.parseAsync(body);

  const status = await courseService.updateCourseById(courseId, data);

  res.json({
    ok: true,
    message: "Success",
    data: status,
    error: null,
  });
});

router.delete("/:id", async (req: Request, res: Response) => {
  const courseId = req.params.id;

  if (!courseId) throw new Error("Id not provided");

  const data = courseService.deleteCourseById(courseId);

  res.json({
    ok: true,
    message: "success",
    data: data,
    error: null,
  });
});
export const courseRouter = router;
