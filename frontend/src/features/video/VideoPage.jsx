import { Box } from "@mui/material";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { fetchMeetingById, fetchProfileApi } from "../../services/teknoplat_server";
import { redirect, useLoaderData } from "react-router-dom";
import Cookies from "js-cookie";
import { fetchCourseById } from "../../services/team_server";
import VideoPageVideoView from "./VideoPage.VideoView";

export async function loader({ request, params }) {
    const meetingId = params.meetingId;
    try {
        const meetingResponse = await fetchMeetingById(meetingId);
        const profileResponse = await fetchProfileApi();
        const courseResponse = await fetchCourseById(meetingResponse.data.course);

        // const ratingResponse = await fetchAccountRatings(meetingId);
        // const remarksResponse = await fetchAccountRemarks(meetingId);

        if (meetingResponse.data.status === "pending" || meetingResponse.data.status === "completed") {
            return redirect("/");
        }

        return { 
            meeting: meetingResponse.data,
            profile: profileResponse.data,
            course: courseResponse.data,
            // ratings: ratingResponse.data,
            // remarks: remarksResponse.data,
            videoAccessToken: Cookies.get("videoAccessToken")
        }
    } catch (error) {
        return redirect("/");
    }
}

export const Component = () => {
    const {meeting, profile, videoAccessToken} = useLoaderData();

    return (
        <Box height="100vh">
            <MeetingProvider
                config={{
                    meetingId: meeting.video,
                    micEnabled: meeting.owner === profile.id,
                    webcamEnabled: meeting.owner === profile.id,
                    name: profile.full_name,
                    participantId: profile.id,
                }}
                token={videoAccessToken}
            >
                <VideoPageVideoView />
            </MeetingProvider>
        </Box>
    );
}

// Component.displayName = "VideoPage";
