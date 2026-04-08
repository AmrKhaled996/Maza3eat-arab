import { axiosInstance } from "../axiosInstence";
import axios, { AxiosError } from "axios";

export async function getHomePosts() {
  try {
    const response = await axiosInstance.get(`/posts/home?scope=community`);
    return response.data.data.posts;
  } catch (error) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error(
      "Error fetching home posts:",
      (axiosError.response?.data?.message || axiosError.message)
    );

    throw error;
  }
}

export async function getHomeFeaturedPosts() {
    try{
        const response = await axiosInstance.get(`/posts/home?scope=admin`);

        return response.data.data.posts;
    } catch (error) {
        const axiosError = error as AxiosError<{message: string}>;
        console.error(
            "Error fetching featured posts:",
            (axiosError.response?.data?.message || axiosError.message)
        );

        throw error;
    }
}

export async function getHomeQuestions() {
    try{
        const response = await axiosInstance.get(`/questions/home`);
        return response?.data?.data.questions;
    }
    catch (error) {
        const axiosError = error as AxiosError<{message: string}>;
        console.error(
            "Error fetching questions:",
            (axiosError.response?.data?.message || axiosError.message)
        );

        throw error;
    }

}
