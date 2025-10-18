import axios from "axios";
import {useAuth} from "@/stores/auth.js";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1'

});

axiosInstance.interceptors.response.use(
    res => res,
    err => {
        // Any HTTP Code which is not 2xx will be considered as error
        const statusCode = err.response.status;
        if (statusCode === 401) {
            const authStore = useAuth()
            authStore.logout()
        }
        throw err;
    }
);


export function useAxios() {
    return axiosInstance
}

export const $axios = axiosInstance;
