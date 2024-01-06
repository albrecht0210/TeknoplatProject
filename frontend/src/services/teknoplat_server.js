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
    const response = await instance.get(`/api/pitches/`);
    return response;
}

export const fetchPitchesByCourse = async (courseId) => {
    const response = await instance.get(`/api/pitches/?course=${courseId}`);
    return response;
}

export const fetchPitchByTeam = async (teamId) => {
    const response = await instance.get(`/api/pitches/?team=${teamId}`);
    return response;
}

export const fetchAllCriterias = async () => {
    const response = await instance.get(`/api/criteria/`);
    return response;
}

export const updateNewMeeting = async (meeting, payload) => {
    const data = {
        ...meeting,
        teacher_weight_score: payload.teacher_weight_score,
        student_weight_score: payload.student_weight_score,
    }
    const response = await instance.put(`/api/meetings/${meeting.id}/`, data);
    return response;
}

export const addMeetingPresentor = async (meetingId, payload) => {
    const data = {
        pitch: payload.presentor
    }
    const response = await instance.post(`/api/meetings/${meetingId}/add_meeting_presentor/`, data);
    return response;
}

export const addMeetingCriteria = async (meetingId, payload) => {
    const data = {
        criteria: payload.criteria,
        weight: payload.weight
    }
    const response = await instance.post(`/api/meetings/${meetingId}/add_meeting_presentor/`, data);
    return response;
}

export const addMeetingComment = async (meetingId, payload) => {
    const data = {
        account: payload.account,
        comment: payload.comment
    }
    const response = await instance.post(`/api/meetings/${meetingId}/add_meeting_comment/`, data);
    return response;
}

export const fetchMeetingsByCourseAndStatus = async (courseId, status, limit = 5, offset = 0) => {
    const response = await instance.get(`/api/meetings/?limit=${limit}&offset=${offset}&course=${courseId}&status=${status}`);
    return response;
}

export const fetchMeetingById = async (meetingId) => {
    const response = await instance.get(`/api/meetings/${meetingId}/`);
    return response;
}

export const updateMeetingStatusAndVideoId = async (meeting, videoId) => {
    const data = {
        ...meeting,
        status: "in_progress",
        video: videoId.meetingId
    };
    const response = await instance.put(`/api/meetings/${meeting.id}/`, data);
    return response;
}

export const fetchAccountRatings = async (meetingId) => {
    const response = await instance.get(`/api/account/ratings/?meeting=${meetingId}`);
    return response;
}

export const fetchAccountRemarks = async (meetingId) => {
    const response = await instance.get(`/api/account/remarks/?meeting=${meetingId}`);
    return response;
}

export const fetchMeetingOverallRatings = async (meetingId) => {
    const response = await instance.get(`/api/meeting/overall_ratings/?meeting=${meetingId}`);
    return response;
}

export const fetchMeetingFeedbacks = async (meetingId) => {
    const response = await instance.get(`/api/feedbacks/?meeting=${meetingId}`);
    return response;
}

export const updateOpenPitchRate = async (pitch) => {
    const data = {
        ...pitch,
        team: pitch.team.id,
        open_rate: true
    }

    const response = await instance.put(`http://localhost:8008/api/pitches/${pitch.id}/`, data);
    return response;
}

export const addPitchRating = async (payload) => {
    const data = {
        rating: payload.rating,
        account: payload.account,
        pitch: payload.pitch,
        meeting: payload.meeting,
        criteria: payload.criteria,
    }

    const response = await instance.post(`http://localhost:8008/api/ratings/`, data);
    return response;
}

export const addPitchFeedback = async (payload) => {
    const data = {
        remark: payload.remark,
        account: payload.account,
        pitch: payload.pitch,
        meeting: payload.meeting,
    }

    const response = await instance.post(`http://localhost:8008/api/remarks/`, data);
    return response;
}

export const generateVideoId = async (videoAccessToken) => {
    const data = {
        token: videoAccessToken
    };
    const response = await instance.post(`/api/video/create-meeting/`, data);
    return response;
}

export const validateVideoId = async (videoAccessToken, videoId) => {
    const data = {
        token: videoAccessToken
    };
    const response = await instance.post(`/api/video/validate-meeting/${videoId}/`, data);
    return response;
}

export const fetchChatbotThread = async (account) => {
    const response = await instance.get(`/api/chatbots/?account=${account}`);
    return response;
}

export const addNewChatToChatbot = async (chatbotId, payload) => {
    const data = {
        chatbot: chatbotId,
        role: "user",
        content: payload.content
    }
    const response = await instance.post(`/api/chatbots/${chatbotId}/add_new_content/`, data);
    return response;
}

export default instance;