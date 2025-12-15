import { compare, hash } from "bcrypt";
import { prisma } from "../../lib/prisma";
import { UserLoginInputSchema, UserRegisterInputSchema } from "./auth.schema";
import { signAccessToken } from "./auth.utils";
import authDomain from "./auth.domain";
import refreshTokenRepo from "./refresh-token.repo";

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
  await refreshTokenRepo.createRefreshToken(refreshTokenObject);

  return {
    accessToken,
    refreshToken,
  };
}

export async function refresh(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const [tokenId, secret] = refreshToken.split(".");
  if (!tokenId) throw new Error("Refresh Token Not Provided");
  if (!secret) throw new Error("Invalid Refresh Token Format");
  // ambil data
  const record = await refreshTokenRepo.findRefreshTokenById(tokenId);
  if (!record) throw new Error("Refresh Token Not Found");
  // lempar ke domain untuk logicnya
  authDomain.validateRefreshToken(refreshToken, record);

  const {
    refreshToken: newRefreshToken,
    refreshTokenObject: newRefreshTokenObject,
  } = authDomain.generateRefreshToken(record.userId);

  // @TODO this to should use transaction
  await refreshTokenRepo.revokeRefreshTokenById(tokenId);
  await refreshTokenRepo.createRefreshToken(newRefreshTokenObject);

  const accessToken = signAccessToken({
    userId: record.userId,
  });

  return { refreshToken: newRefreshToken, accessToken };
}

export async function logout(refreshToken: string): Promise<void> {
  const [tokenId, secret] = refreshToken.split(".");

  if (!tokenId) throw new Error("Refresh Token Not Provided");
  if (!secret) throw new Error("Invalid Refresh Token Format");

  await refreshTokenRepo.revokeRefreshTokenById(tokenId);
}
export default {
  register,
  login,
  logout,
  refresh,
};
