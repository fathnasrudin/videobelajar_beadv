import express, { Request } from "express";
import cors from "cors";
import { Application } from "express";
import { Response } from "express";
import cookieParser from "cookie-parser";
import { courseRouter } from "./features/course/course.route";
import { categoryRouter } from "./features/category/category.route";
import "dotenv/config";
import { authRouter } from "./features/auth/auth.route";
import { emailVerificationRouter } from "./features/email-verification/email-verification.route";
import { config } from "./config";
import { errorMiddleware } from "./lib/error/error.middleware";
import { uploadRouter } from "./features/upload/upload.route";

const app: Application = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500", //@TODO make the origin right with proper config
    methods: ["GET", "POST"],
    credentials: true, // untuk kirim cookie
  })
);
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
app.use("/api/upload", uploadRouter);

app.post("/api/webhooks/cloudinary", express.json(), (req, res) => {
  console.log("headers:", req.headers);
  console.log("body:", req.body);

  res.status(200).send("ok");
});
// error handler
app.use(errorMiddleware);

app.listen(config.app.port, () => {
  console.log(`running on port ${config.app.port}`);
});
