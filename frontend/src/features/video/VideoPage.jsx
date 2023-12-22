import { Box } from "@mui/material";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { fetchMeeting } from "../../services/teknoplat_server";
import { redirect, useLoaderData, useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";

export async function loader({ request, params }) {
    const meetingId = params.meetingId;
    try {
        const meetingResponse = await fetchMeeting(meetingId);
        const meeting = meetingResponse.data;

        if (meeting.status === "pending" || meeting.status === "completed") {
            return redirect("/");
        }

        return { 
            meeting: meeting,
            videoAccessToken: Cookies.get("videoAccessToken"),
        }
    } catch (error) {
        return redirect("/");
    }
}

function VideoPage() {
    const data = useLoaderData();
    const { profile } = useOutletContext();
    return (
        <Box height="100vh">
            <MeetingProvider
                config={{
                    meetingId: data.meeting.video,
                    micEnabled: data.meeting.owner === profile.id,
                    webcamEnabled: data.meeting.owner === profile.id,
                    name: profile.full_name,
                    participantId: profile.id,
                }}
                token={data.videoAccessToken}
            >
            </MeetingProvider>
        </Box>
    );
}

export default VideoPage;
