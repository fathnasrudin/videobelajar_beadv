import { prisma } from "../../lib/prisma";
import { EmailVerification } from "./email-verification.schema";

async function findEVByTokenHash(hashedToken: string) {
  return prisma.emailVerificationToken.findFirst({
    where: { tokenHash: hashedToken },
  });
}

async function findEVById(id: string) {
  return prisma.emailVerificationToken.findFirst({
    where: { id },
  });
}

async function invalidEmailVerificationToken(userId: string) {
  return prisma.emailVerificationToken.updateMany({
    where: {
      AND: {
        userId: userId,
        usedAt: null,
      },
    },
    data: {
      usedAt: new Date(),
    },
  });
}

async function updateEVasUsedById(tokenId: string) {
  return prisma.emailVerificationToken.update({
    where: { id: tokenId },
    data: { usedAt: new Date() },
  });
}

async function createEmailVerificationRecord(data: EmailVerification) {
  return prisma.emailVerificationToken.create({
    data,
  });
}

export default {
  findEVByTokenHash,
  findEVById,
  invalidEmailVerificationToken,
  updateEVasUsedById,
  createEmailVerificationRecord,
};
