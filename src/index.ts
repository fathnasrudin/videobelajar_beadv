import express, { Request } from "express";
import { Application } from "express";
import { Response } from "express";
import { courseRouter } from "./features/course/course.route";

const app: Application = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Success connect to" });
});

app.use("/api/courses", courseRouter);

app.listen(PORT, () => {
  console.log(`running on http://localhost:${PORT}`);
});
