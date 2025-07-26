import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
// import { IOtpSchema } from "../types/type";

import { type IOtpSchema } from "@shared/types/otp.types";

interface IOtpSchemaDocument extends IOtpSchema, Document {
  compareOtp(otp: string): Promise<boolean>;
}

const otpSchema = new Schema<IOtpSchemaDocument>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["verify_email", "verify_phone", "reset_password"],
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

otpSchema.pre("save", async function (next) {
  if (this.isModified("otp")) {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
  }
  next();
});

otpSchema.methods.compareOtp = async function (otp: string): Promise<boolean> {
  return bcrypt.compare(otp, this.otp);
};

const Otp = mongoose.model<IOtpSchemaDocument>("Otp", otpSchema);
export default Otp;
