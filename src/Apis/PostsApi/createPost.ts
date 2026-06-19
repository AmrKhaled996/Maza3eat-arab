import type { AxiosError, AxiosHeaders } from "axios";
import { axiosInstance } from "../axiosInstance";

/** Multer field name for image files — must match `uploadPostImages` in the API */
export const POST_IMAGE_FIELD = "images";

export type CreatePostResponse = {
  status: string;
  data: { id: string; [key: string]: unknown };
};

export async function createPost(formData: FormData) {
  return axiosInstance.post<CreatePostResponse>("/posts", formData, {
    transformRequest: [
      (data, headers) => {
        const h = headers as AxiosHeaders | undefined;
        if (h && typeof h.delete === "function") {
          h.delete("Content-Type");
        }
        return data;
      },
    ],
  });
}

export function getCreatePostErrorMessage(error: unknown): string {
  const ax = error as AxiosError<{ message?: string; errors?: Record<string, string> }>;
  if (ax.response?.data?.errors) {
    const errList = Object.entries(ax.response.data.errors)
      .map(([field, msg]) => `${field}: ${msg}`)
      .join(", ");
    return `${ax.response.data.message || "Validation failed"}: ${errList}`;
  }
  return (
    ax.response?.data?.message ||
    ax.message ||
    "Request failed"
  );
}
