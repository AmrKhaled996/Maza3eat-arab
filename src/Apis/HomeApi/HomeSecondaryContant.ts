import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";

// Function to fetch popular questions for the home page
export async function getHomePopularQuestions() {
    try {
        const response = await axiosInstance.get(`/questions/popular?limit=3`);
        return response.data.data;
    } catch (error) {
        const axiosError = error as AxiosError<{message: string}>;
        console.error(
            "Error fetching popular questions:",
            (axiosError.response?.data?.message || axiosError.message)
        );
        throw error;
    }
}

// Function to fetch top trending tags for the home page
export async function getHomeTopTrending() {
    try{
        const response =await axiosInstance.get(`tags/trending?limit=3`)
        return response.data.data;
    }catch(error){
        const axiosError = error as AxiosError<{message: string}>;
        console.error(
            "Error fetching top trending tags:",
            (axiosError.response?.data?.message || axiosError.message)
        );
        throw error;    
    }
}

// Function to fetch Ads in the home page