import { baseUrl } from "@/configs/config";
import axios from "axios";

export const specialBanner = `/v1/get-specials`;

export const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {},
    // withCredentials: true,
});