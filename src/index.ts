import express, { Request } from "express";
import { Application } from "express";
import { Response } from "express";
import cookieParser from "cookie-parser";
import { courseRouter } from "./features/course/course.route";
import { categoryRouter } from "./features/category/category.route";
import "dotenv/config";
import { authRouter } from "./features/auth/auth.route";
import { emailVerificationRouter } from "./features/email-verification/email-verification.route";

const app: Application = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Success connect to" });
});

app.use("/api/courses", courseRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/email-verification", emailVerificationRouter);

app.listen(PORT, () => {
  console.log(`running on http://localhost:${PORT}`);
});
