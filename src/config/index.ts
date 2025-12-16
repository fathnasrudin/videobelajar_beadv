export const config = {
  app: {
    baseUrl: process.env.BASE_URL as string,
    port: process.env.PORT,
  },
  emailVerification: {
    secret: process.env.EMAIL_VERIFICATION_SECRET as string,
    duration: 15 * 60 * 1000, // 15 minutes
    url: {
      full: `${process.env.BASE_URL as string}/api/email-verification/verify`,
    },
    sender: process.env.EMAIL_VERIFICATION_SENDER as string,
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY as string,
  },
};
