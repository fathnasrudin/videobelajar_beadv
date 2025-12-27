import { Request, Response, Router, Router as RouterType } from "express";
import { uploadService } from "./upload.service";

const router: RouterType = Router();

router.post("/signature", (req: Request, res: Response) => {
  const sigData = uploadService.generate(
    { owner: "course", asset: "thumbnail" },
    "123"
  );

  res.json({
    data: sigData,
  });
});

export const uploadRouter = router;
