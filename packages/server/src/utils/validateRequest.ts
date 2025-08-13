import { ZodSchema } from "zod";
import type { Socket } from "socket.io";
import { SocketEvents } from "../constants";
import { formatErrorMessages } from ".";

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: any };

function validateRequest<T>(
  schema: ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  if (data === undefined || data === null) {
    return {
      success: false,
      error: { general: ["Request body is missing or empty."] },
    };
  }

  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    const errorMessages = parsed.error.flatten().fieldErrors;
    return {
      success: false,
      error: errorMessages,
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}

function validateSocketData<T>(
  schema: ZodSchema<T>,
  data: unknown,
  socket: Socket
) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    socket.emit(SocketEvents.INVALID_DATA, {
      error: formatErrorMessages(
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      ),
    });
    return false;
  } else {
    return true;
  }
}

export { validateRequest, validateSocketData };
