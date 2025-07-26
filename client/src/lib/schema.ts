import { z } from "zod";

const SignupSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  bio: z.string().max(100, "Bio cannot exceed 100 characters").optional(),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

const LoginSchema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

export { SignupSchema, LoginSchema };

export type TSignupSchemaType = z.infer<typeof SignupSchema>;
export type TLoginSchemaType = z.infer<typeof LoginSchema>;
