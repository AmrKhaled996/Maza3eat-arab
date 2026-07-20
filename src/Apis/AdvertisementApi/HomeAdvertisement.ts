import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";

export async function getHomeAdvertisement() {
    try{
        const response = await axiosInstance.get(`/ads/home`);

        return response.data.data.ads;
    } catch (error) {
        const axiosError = error as AxiosError<{message: string}>;
        console.error(
            "Error fetching featured posts:",
            (axiosError.response?.data?.message || axiosError.message)
        );

        throw error;
    }
}