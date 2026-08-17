
import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";

/**
 * Builds the `&search=` query fragment.
 * A leading "#" (tag pills link with `?search=#tagName`) is stripped — the backend
 * matches tags by their bare normalized name — and the value is encoded so "#",
 * spaces and Arabic text survive the URL instead of being cut off as a fragment.
 */
function searchParam(searchTerm: string) {
  const clean = (searchTerm || "").trim().replace(/^#+/, "");
  return clean ? `&search=${encodeURIComponent(clean)}` : "";
}

export async function getQuestionsBySearch(searchTerm: string ,sortBy: string ) {
  try {
    const response = await axiosInstance.get(`/questions?sort=${sortBy}${searchParam(searchTerm)}`);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error(
      "Error fetching home posts:",
      (axiosError.response?.data || axiosError.message)
    );

    throw error;
  }
}

//with cursor
export async function getQuestionsBySearchWithCursor(searchTerm: string ,sortBy: string, cursor:string ) {

  try {
    const response = await axiosInstance.get(`/questions?sort=${sortBy}${searchParam(searchTerm)}&cursor=${cursor}`);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error(
      "Error fetching home posts:",
      (axiosError.response?.data || axiosError.message)
    );

    throw error;
  }
}