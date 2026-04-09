import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstence";

export async function getCommunityPostsBySearch(searchTerm: string ,sortBy: string ) {
  try {
    const response = await axiosInstance.get(`/posts?scope=community&sort=${sortBy}${searchTerm&&`&search=${searchTerm}`}`);
    // console.log(response.data)
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
export async function getCommunityPostsBySearchWithCursor(searchTerm: string ,sortBy: string, cursor:string ) {

  try {
    const response = await axiosInstance.get(`/posts?scope=community&sort=${sortBy}${searchTerm&&`&search=${searchTerm}`}&cursor=${cursor}`);
    // console.log(response.data)
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