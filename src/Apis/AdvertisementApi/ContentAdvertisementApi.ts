import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";

export async function getContentAdvertisement() {
    try{
        const response = await axiosInstance.get(`/ads/post`);

        return response.data.data;
    } catch (error) {
        const axiosError = error as AxiosError<{message: string}>;
        console.error(
            "Error fetching featured posts:",
            (axiosError.response?.data?.message || axiosError.message)
        );

        throw error;
    }
}