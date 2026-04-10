
import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";


export async function getQuestionsBySearch(searchTerm: string ,sortBy: string ) {
  try {
    console.log("search ",searchTerm,"sort:",sortBy)
    const response = await axiosInstance.get(`/questions?sort=${sortBy}${searchTerm&&`&search=${searchTerm}`}`);
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
export async function getQuestionsBySearchWithCursor(searchTerm: string ,sortBy: string, cursor:string ) {

  try {
    console.log("search ",searchTerm,"sort:",sortBy)
    const response = await axiosInstance.get(`/questions?sort=${sortBy}${searchTerm&&`&search=${searchTerm}`}&cursor=${cursor}`);
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