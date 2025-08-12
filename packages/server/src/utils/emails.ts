import { createTransport } from "nodemailer";
import { EMAIL_VERIFICATION_TEMPLATE } from "@/constants/emailTemplates";

const transposer = createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

interface EmailVerificationParams {
  to: string;
  username: string;
  otp: string;
  otpValidity: number;
}

const buildEmailHtml = ({
  username,
  otp,
  otpValidity,
}: Omit<EmailVerificationParams, "to">): string => {
  return EMAIL_VERIFICATION_TEMPLATE.replace("{{username}}", username)
    .replace("{{otp}}", otp)
    .replace("{{otpValidity}}", otpValidity.toString())
    .replace("{{year}}", new Date().getFullYear().toString());
};

const sendEmailVerificationEmail = async ({
  to,
  username,
  otp,
  otpValidity,
}: EmailVerificationParams): Promise<void> => {
  try {
    const html = buildEmailHtml({ username, otp, otpValidity });

    const info = await transposer.sendMail({
      from: '"Connectly" <no-reply@connectly.com>',
      to,
      subject: "Verify your email",
      html,
    });

    console.log("Verification email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

export { sendEmailVerificationEmail };
