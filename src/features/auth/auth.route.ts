import { Router, Router as IRouter, Request, Response } from "express";
import { userLoginSchema, userRegisterSchema } from "./auth.schema";
import authService from "./auth.service";
import authMiddleware from "./auth.middleware";
import { signAccessToken } from "./auth.utils";

const router: IRouter = Router();

router.get("/register", async (req: Request, res: Response) => {
  const body = req.body;
  const data = await userRegisterSchema.parseAsync(body);

  const user = await authService.register(data);
  res.status(201).json({ message: "Success" });
});

router.get("/login", async (req: Request, res: Response) => {
  const body = req.body;
  const data = await userLoginSchema.parseAsync(body);

  const { refreshToken, accessToken } = await authService.login(data);

  // set refresh token to the cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/auth/refresh",
  });

  res.status(200).json({ message: "Success", data: { accessToken } });
});

router.get("/refresh", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  // dapat refresh token
  // panggil service untuk mendapat access dan refresh token baru.

  // di service, harus lakuin beberapa hal
  // ambil data dari db
  // kasih ke domain, kalo berhasil buat access, refreshToken, rtobject,
  // simpan rt object ke db
  // return access dan refresh
  //

  if (!refreshToken) throw new Error("Refresh Token Not Provided");

  const { refreshToken: newRefreshToken, accessToken: newAccessToken } =
    await authService.refresh(refreshToken);

  // set refreshToken to the cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/auth/refresh",
  });

  res
    .status(200)
    .json({ message: "Success", data: { accessToken: newAccessToken } });
});

router.get(
  "/protected",
  authMiddleware.verify,
  (req: Request, res: Response) => {
    res.json({ message: "Success access protected resource", user: req.user });
  }
);

export const authRouter = router;
