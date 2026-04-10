import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstence";

// Function to fetch popular questions for the home page
export async function getHomePopularQuestions(limit: number) {
    try {
        const response = await axiosInstance.get(`/questions/popular?limit=${limit}`);
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
export async function getHomeTopTrending(limit: number) {
    try{
        const response =await axiosInstance.get(`tags/trending?limit=${limit}`)
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