import { AxiosError } from "axios";
import { showToast } from "./utils";

// Assume this is your toast utility function
/**
 * Handles API errors and shows a toast with a user-friendly message.
 * @param error The error object (can be AxiosError or unknown)
 * @param fallbackMessage The default message if no error message is available
 * @param showToast Your toast function (e.g. shadcn's or custom)
 */
function handleApiError(
  error: unknown,
  fallbackMessage: string,
  title = "Error"
): void {
  if (error instanceof AxiosError) {
    const message =
      error.response?.data?.message || error.message || fallbackMessage;

    showToast(title, message, "error");
  } else {
    showToast(title, fallbackMessage, "error");
  }
}
export { handleApiError };
