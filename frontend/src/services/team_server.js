import axios from 'axios';
import Cookies from "js-cookie";
import { redirect } from "react-router-dom";
import { generateAccessTokenApi } from './wildcat_server';

const instance = axios.create({
    baseURL: process.env.REACT_APP_TEAM_BASE_URL,
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

export const fetchAccountCourses = async () => {
    const response = await instance.get(`/api/account/profile/courses/`);
    return response;
}

export const fetchAccountTeams = async () => {
    const response = await instance.get(`/api/account/profile/teams/`);
    return response;
}

export const fetchTeamsByCourse = async (courseId) => {
    const response = await instance.get(`/api/teams/?course=${courseId}`);
    return response;
}

export const fetchCourseById = async (courseId) => {
    const response = await instance.get(`/api/courses/${courseId}`);
    return response;
}

export const fetchAllCourses = async () => {
    const response = await axios.get(`${process.env.REACT_APP_TEAM_BASE_URL}/api/public/course/list/`);
    return response;
}

export const fetchTeamsByCoursePublic = async (courseId) => {
    const response = await axios.get(`${process.env.REACT_APP_TEAM_BASE_URL}/api/public/team/list/?course=${courseId}`);
    return response;
}

export const createTeam = async (payload) => {
    const response = await axios.post(`${process.env.REACT_APP_TEAM_BASE_URL}/api/public/team/create/`, payload);
    return response;
}

export default instance;