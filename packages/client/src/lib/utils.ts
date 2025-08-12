import type { IChatPreview } from "@/types/api-response.type";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showToast(
  title: string,
  description: string,
  type: "success" | "error",
  duration = 5000
) {
  toast(title, {
    description,
    descriptionClassName:
      type === "success" ? "description-success" : "description-error",
    position: "bottom-right",
    duration,
  });
}

const GROUP_AVATAR_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROwEIMOLfVpbKfw9EYVreHkPB4FAmFJ7DYow&s";

export type ChatDisplayMeta = {
  displayName: string;
  avatarUrl: string;
  fallback: string;
};

export function getChatDisplayMeta(
  chat: IChatPreview,
  currentUserId: string
): ChatDisplayMeta {
  if (chat.isGroup) {
    const name = chat.name || "Unnamed Group";
    return {
      displayName: name,
      avatarUrl: GROUP_AVATAR_URL,
      fallback: name[0]?.toUpperCase() || "G",
    };
  }

  const other = chat.participants.find((p) => p._id !== currentUserId);
  const displayName = other?.username || "Unknown";
  const avatarUrl = other?.avatar || "";
  const fallback = displayName.slice(0, 2).toUpperCase();

  return { displayName, avatarUrl, fallback };
}
