import express, { Request } from "express";
import { Application } from "express";
import { Response } from "express";

const app: Application = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Success connect to" });
});

app.route("/api/courses").get((req: Request, res: Response) => {
  res.json({ message: "Success connect to" });
});

app.listen(PORT, () => {
  console.log(`running on http://localhost:${PORT}`);
});
