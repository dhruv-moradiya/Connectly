interface IOtpSchema {
  email: string;
  otp: string;
  purpose: "verify_email" | "verify_phone" | "reset_password";
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
  compareOtp: (otp: string) => Promise<boolean>;
}
export type { IOtpSchema };
