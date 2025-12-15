import userRepo from "../user/user.repo";
import emailVerificationDomain from "./email-verification.domain";
import emailVerificationRepo from "./email-verification.repo";

export async function sendEmailVerification(userId: string) {
  const user = await userRepo.findUserById(userId);
  if (!user) throw new Error("User Not Found");

  const { token, evObject } =
    emailVerificationDomain.createEmailVerification(user);

  // invalid token email sebelumnya yang masih aktif
  await emailVerificationRepo.invalidEmailVerificationToken(user.id);

  // simpan data sekarang
  await emailVerificationRepo.createEmailVerificationRecord(evObject);

  // kirim email
  console.log({
    message: "Dummy sending email verif",
    token,
  });
}

export async function verifyEmailToken({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) {
  const hashedToken = emailVerificationDomain.hashEmailVerificationToken(token);
  const record = await emailVerificationRepo.findEVByTokenHash(hashedToken);
  const user = await userRepo.findUserById(userId);

  if (!record) throw new Error("Token Not Found");
  if (!user) throw new Error("User Not Found");

  emailVerificationDomain.verifyEmailToken({ evObject: record, user });

  // mark the user as verified
  await userRepo.updateUserAsVerified(userId);
  // mark the record as used
  await emailVerificationRepo.updateEVasUsedById(record.id);
}

export default {
  sendEmailVerification,
  verifyEmailToken,
};
