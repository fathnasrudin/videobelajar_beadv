import { RefreshToken } from "./refresh-token.schema";
import crypto from "crypto";

function generateRefreshSecret(): string {
  return crypto.randomBytes(64).toString("hex");
}

function hashRefreshSecret(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function verifyRefreshSecret(
  plainSecret: string,
  hashedSecret: string
): boolean {
  const incomingHash = hashRefreshSecret(plainSecret);

  if (incomingHash.length !== hashedSecret.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(incomingHash, "hex"),
    Buffer.from(hashedSecret, "hex")
  );
}

function generateRefreshToken(userId: string): {
  refreshToken: string;
  refreshTokenObject: RefreshToken;
} {
  const refreshSecret = generateRefreshSecret();
  const refreshTokenObject = createRefreshTokenObject({
    refreshSecret,
    userId,
  });
  return {
    refreshToken: `${refreshTokenObject.id}.${refreshSecret}`,
    refreshTokenObject,
  };
}

function validateRefreshToken(
  refreshToken: string,
  refreshTokenRecord: RefreshToken
) {
  const [refreshId, refreshSecret] = refreshToken.split(".");

  if (!refreshSecret) throw new Error("Invalid Refresh Token Format");

  if (!verifyRefreshSecret(refreshSecret, refreshTokenRecord.secretHash)) {
    throw new Error("Token doesn't match");
  }

  if (refreshTokenRecord.expiresAt < new Date()) {
    throw new Error("Refresh Token Expired");
  }

  if (refreshTokenRecord.revokedAt) {
    throw new Error(
      "DANGER! REFRESH TOKEN REUSED. Probably token leaked. Revoke all session for this user. Flag it. Make an alert"
    );
  }

  return true;
}

function createRefreshTokenObject(data: {
  userId: string;
  refreshSecret: string;
}): RefreshToken {
  const hashedRefreshSecret = hashRefreshSecret(data.refreshSecret);

  const refreshTokenData: RefreshToken = {
    id: crypto.randomUUID(),
    secretHash: hashedRefreshSecret,
    userId: data.userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    revokedAt: null,
  };
  return refreshTokenData;
}

export default {
  generateRefreshToken,
  validateRefreshToken,
  createRefreshTokenObject,
};
