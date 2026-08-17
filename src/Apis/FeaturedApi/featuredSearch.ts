import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";


export async function getFeaturedPostsBySearch(searchTerm: string ,sortBy: string ) {
  try {
    const response = await axiosInstance.get(`/posts?scope=admin&sort=${sortBy}${searchTerm&&`&search=${searchTerm}`}`);
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
export async function getFeaturedPostsBySearchWithCursor(searchTerm: string ,sortBy: string, cursor:string ) {

  try {
    const response = await axiosInstance.get(`/posts?scope=admin&sort=${sortBy}${searchTerm&&`&search=${searchTerm}`}&cursor=${cursor}`);
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