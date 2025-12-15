import crypto from "crypto";
import { config } from "../../config";
import { EmailVerification } from "./email-verification.schema";
import { User } from "../user/user.schema";

function generateEmailVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashEmailVerificationToken(token: string) {
  return crypto
    .createHmac("sha256", config.emailVerification.secret)
    .update(token)
    .digest("hex");
}

export function generateAndHashVerificationToken() {
  const token = generateEmailVerificationToken();
  const tokenHash = hashEmailVerificationToken(token);
  return { token, tokenHash };
}

export function createEVObject({
  plainToken,
  userId,
}: {
  plainToken: string;
  userId: string;
}): EmailVerification {
  const tokenHash = hashEmailVerificationToken(plainToken);
  return {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + config.emailVerification.duration), // fifteen minutes,
    tokenHash,
    usedAt: null,
    userId,
  };
}

export function createEmailVerification(user: User): {
  evObject: EmailVerification;
  token: string;
} {
  // validate
  if (user.isVerified) throw new Error("User Already Verified");

  const token = generateEmailVerificationToken();

  const evObject = createEVObject({
    plainToken: token,
    userId: user.id,
  });

  return { evObject, token };
}

export function verifyEmailToken({
  user,
  evObject,
}: {
  user: User;
  evObject: EmailVerification;
}) {
  if (user.id !== evObject.userId)
    throw new Error("DANGER! USER TRY TO ACCESS OTHER USER EMAIL TOKEN");
  if (user.verifiedAt) throw new Error("User already verified");
  if (evObject.expiresAt < new Date()) throw new Error("Token Expired");
  if (evObject.usedAt) throw new Error("Token Already Used");
  return true;
}

export default {
  hashEmailVerificationToken,
  generateAndHashVerificationToken,
  generateEmailVerificationToken,
  createEVObject,
  createEmailVerification,
  verifyEmailToken,
};
