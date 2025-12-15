import { Router, Router as IRouter, Request, Response } from "express";
import authMiddleware from "../auth/auth.middleware";
import emailVerificationService from "./email-verification.service";

const router: IRouter = Router();

router.get(
  "/send",
  authMiddleware.verify,
  async (req: Request, res: Response) => {
    const userData = req.user;
    if (!userData) throw new Error("Not Authenticated");

    await emailVerificationService.sendEmailVerification(userData.id);

    res.status(200).json({
      message: "Email Verification Sent",
    });
  }
);

router.get(
  "/verify",
  authMiddleware.verify,
  async (req: Request, res: Response) => {
    const token = req.query.token as string;
    const userId = req.user?.id;
    if (!userId) throw new Error("User Not Found");
    if (!token) throw new Error("Token Not Found");
    if (typeof token !== "string")
      throw new Error("Something went wrong! Somehow token is not a string");

    await emailVerificationService.verifyEmailToken({ token, userId });

    res.status(200).json({
      message: "User Verified",
    });
  }
);
export const emailVerificationRouter = router;
