import { prisma } from "../../lib/prisma";

export async function findUserById(userId: string) {
  return prisma.user.findFirst({
    where: { id: userId },
  });
}

export async function updateUserAsVerified(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { verifiedAt: new Date() },
  });
}

export default {
  findUserById,
  updateUserAsVerified,
};
