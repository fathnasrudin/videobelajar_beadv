import { compare, hash } from "bcrypt";
import { prisma } from "../../lib/prisma";
import { UserLoginInputSchema, UserRegisterInputSchema } from "./auth.schema";
import { signAccessToken } from "./auth.utils";
import { RefreshToken } from "./refresh-token.schema";
import authDomain from "./auth.domain";

const refreshTokenList: RefreshToken[] = [];

export async function register(data: UserRegisterInputSchema) {
  const hashedPw = await hash(data.password, 10);

  const user = await prisma.user.create({
    data: { ...data, password: hashedPw },
  });

  return user;
}

export async function login(
  data: UserLoginInputSchema
): Promise<{ accessToken: string; refreshToken: string }> {
  const user = await prisma.user.findFirst({ where: { email: data.email } });
  if (!user) throw new Error("Email or Password invalid");

  const isPasswordMatch = await compare(data.password, user.password);
  if (!isPasswordMatch) throw new Error("Email or Password invalid");

  const accessToken = signAccessToken({ userId: user.id });
  const { refreshToken, refreshTokenObject } = authDomain.generateRefreshToken(
    user.id
  );

  // save the hashed refresh token to the db
  refreshTokenList.push(refreshTokenObject);

  return {
    accessToken,
    refreshToken,
  };
}

export async function refresh(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const [tokenId, secret] = refreshToken.split(".");
  if (!secret) throw new Error("Invalid Refresh Token Format");
  // ambil data
  const record = refreshTokenList.find((rt) => rt.id === tokenId);
  if (!record) throw new Error("Refresh Token Not Found");
  // lempar ke domain untuk logicnya
  authDomain.validateRefreshToken(refreshToken, record);

  // revoke current token
  refreshTokenList.forEach((rt) => {
    if (rt.id === tokenId) {
      rt.revokedAt = new Date();
    }
  });

  const {
    refreshToken: newRefreshToken,
    refreshTokenObject: newRefreshTokenObject,
  } = authDomain.generateRefreshToken(record.userId);

  // untuk db
  refreshTokenList.push(newRefreshTokenObject);

  const accessToken = signAccessToken({
    userId: record.userId,
  });

  return { refreshToken: newRefreshToken, accessToken };
}

export default {
  register,
  login,
  refresh,
};
