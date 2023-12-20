import axios from 'axios';
import Cookies from "js-cookie";
import { redirect } from "react-router-dom";
import { generateAccessTokenApi } from './wildcat_server';

const instance = axios.create({
    baseURL: process.env.REACT_APP_ACTIVITY_BASE_URL,
    timeout: 5000, 
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request.use(
    config => {
        const accessToken = Cookies.get("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = Cookies.get("refreshToken");

                const response = await generateAccessTokenApi({ refresh: refreshToken });
                const newAccessToken = response.data.access;
                
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                Cookies.set("accessToken", newAccessToken);
                
                return instance(originalRequest);
            } catch (error) {
                console.error('Error refreshing token:', error);
                return redirect("/login");
            }
        }
        return Promise.reject(error);
    }
);

export const addNewActivity = async (payload) => {
    const data = {
        name: payload.name,
        description: payload.description,
        status: "pending",
        course: localStorage.getItem("course"),
        service: "teknoplat",
        owner: payload.account
    };

    const response = await instance.post(`/api/activities/`, data);
    return response;
}

export default instance;