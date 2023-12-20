import axios from 'axios';
import Cookies from "js-cookie";
import { redirect } from "react-router-dom";
import { generateAccessTokenApi } from './wildcat_server';

const instance = axios.create({
    baseURL: process.env.REACT_APP_TEKNOPLAT_BASE_URL,
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

export const fetchProfileApi = async () => {
    const response = await instance.get(`/api/account/profile/`);
    return response;
}

export const authenticateVideoSDKApi = async () => {
    const response = await instance.post("/api/video/authenticate/", null);
    return response;
}

export const fetchPitches = async () => {
    const response = await axios.get(`/api/pitches/`);
    return response;
}

export const fetchPitchByTeam = async (teamId) => {
    const response = await axios.get(`/api/pitches/?team=${teamId}`);
    return response;
}

export const fetchAllCriterias = async () => {
    const response = await axios.get(`/api/criteria/`);
    return response;
}

export const updateNewMeeting = async (meeting, payload) => {
    const data = {
        ...meeting,
        teacher_weight_score: payload.teacher_weight_score,
        student_weight_score: payload.student_weight_score,
    }
    const response = await axios.put(`/api/meetings/${meeting.id}/`, data);
    return response;
}

export const addMeetingPresentor = async (meetingId, payload) => {
    const data = {
        pitch: payload.presentor
    }
    const response = await axios.post(`/api/meetings/${meetingId}/add_meeting_presentor/`, data);
    return response;
}

export const addMeetingCriteria = async (meetingId, payload) => {
    const data = {
        criteria: payload.criteria,
        weight: payload.weight
    }
    const response = await axios.post(`/api/meetings/${meetingId}/add_meeting_presentor/`, data);
    return response;
}

export const fetchMeetingsByCourse = async () => {

}

export const fetchMeeting = async (meetingId) => {
    const response = await axios.get(`/api/meetings/${meetingId}/`);
    return response;
}

export default instance;