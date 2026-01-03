import { Request, Response, Router, Router as RouterType } from "express";
import { uploadService, UploadTarget } from "./upload.service";
import { uploadSaveSchema, uploadSignatureSchema } from "./upload.schema";

const router: RouterType = Router();

router.post("/signature", async (req: Request, res: Response) => {
  const data = await uploadSignatureSchema.parseAsync(req.body);

  const sigData = uploadService.generate(data);

  res.json({
    data: sigData,
  });
});

router.post("/save", async (req: Request, res: Response) => {
  const { ownerId, ownerType, assetRole, publicId } =
    await uploadSaveSchema.parseAsync(req.body);

  await uploadService.upsertAsset(
    { ownerId, ownerType, role: assetRole },
    { public_id: publicId }
  );

  res.json({
    message: "saved",
  });
});
export const uploadRouter = router;
