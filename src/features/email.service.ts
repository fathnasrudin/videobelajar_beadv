import { Resend } from "resend";
import { config } from "../config";
import { User } from "./user/user.schema";
const resend = new Resend(config.resend.apiKey);

async function sendVerificationEmail({
  user,
  verificationLink,
}: {
  user: User;
  verificationLink: string;
}) {
  return resend.emails.send({
    from: config.emailVerification.sender,
    to: [user.email],
    subject: "Verifikasi Email Kamu",
    html: `
    <strong><a href="${verificationLink}">Klik Di Sini untuk verifikasi email</a></strong>`,
  });
}

export default {
  sendVerificationEmail,
};
