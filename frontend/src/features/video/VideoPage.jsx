import { Box } from "@mui/material";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { fetchMeeting } from "../../services/teknoplat_server";
import { redirect, useOutletContext } from "react-router-dom";
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
            mic: localStorage.getItem("openMic"),
            webcam: localStorage.getItem("openWebcam")
        }
    } catch (error) {
        return redirect("/");
    }
}

function VideoPage() {
    const data = useOutletContext();

    return (
        <Box height="100vh">
            <MeetingProvider
                config={{
                    meetingId: data.meeting.video,
                    micEnabled: data.mic === "true",
                    webcamEnabled: data.webcam === "true",
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
