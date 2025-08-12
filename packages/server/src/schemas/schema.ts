import { z } from "zod";

const createNewUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Email format is invalid"),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, "Password must be at least 6 characters long"),

  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .min(1, "Username cannot be empty"),

  bio: z.string().optional(),
});

const loginUserSchema = z.object({
  username: z.string({
    required_error: "Username is required",
    invalid_type_error: "Username must be a string",
  }),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
});

const verifyOtpSchema = z.object({
  otp: z.string({
    required_error: "OTP is required",
    invalid_type_error: "OTP must be a string",
  }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Email format is invalid"),
});

const createNewChatBetweenTwoUsersSchema = z.object({
  userId: z.string({
    required_error: "User ID is required",
    invalid_type_error: "User ID must be a string",
  }),
});

const createGroupChatSchema = z.object({
  userIds: z
    .array(
      z.string({
        required_error: "User IDs are required",
        invalid_type_error: "User IDs must be an array of strings",
      })
    )
    .nonempty(),
  name: z.string({
    required_error: "Group name is required",
    invalid_type_error: "Group name must be a string",
  }),
  description: z.string().optional(),
});

const renameGroupChatSchema = z.object({
  name: z.string({
    required_error: "Group name is required",
    invalid_type_error: "Group name must be a string",
  }),
});

const updateGroupChatDescriptionSchema = z.object({
  description: z.string({
    required_error: "Group description is required",
    invalid_type_error: "Group description must be a string",
  }),
});

const addParticipantsSchema = z.object({
  userIds: z
    .array(
      z.string({
        required_error: "User IDs are required",
        invalid_type_error: "User IDs must be an array of strings",
      })
    )
    .nonempty(),
});

export {
  createNewUserSchema,
  loginUserSchema,
  verifyOtpSchema,
  createNewChatBetweenTwoUsersSchema,
  createGroupChatSchema,
  renameGroupChatSchema,
  updateGroupChatDescriptionSchema,
  addParticipantsSchema,
};
export type ICreateNewUserBody = z.infer<typeof createNewUserSchema>;
export type ILoginUserBody = z.infer<typeof loginUserSchema>;
export type IVerifyOtpBody = z.infer<typeof verifyOtpSchema>;
export type ICreateNewChatBetweenTwoUsersBody = z.infer<
  typeof createNewChatBetweenTwoUsersSchema
>;
export type ICreateGroupChatBody = z.infer<typeof createGroupChatSchema>;
export type IRenameGroupChatBody = z.infer<typeof renameGroupChatSchema>;

export type IUpdateGroupChatDescriptionBody = z.infer<
  typeof updateGroupChatDescriptionSchema
>;
export type IAddParticipantsBody = z.infer<typeof addParticipantsSchema>;
