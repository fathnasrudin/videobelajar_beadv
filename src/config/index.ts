export const config = {
  emailVerification: {
    secret: process.env.EMAIL_VERIFICATION_SECRET as string,
    duration: 15 * 60 * 1000, // 15 minutes
  },
};
