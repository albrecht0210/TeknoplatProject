import { Paper, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useLoaderData } from "react-router-dom";
import VideoPageVideoViewRatePanelPresentor from "./VideoPage.VideoView.RatePanel.Presentor";
import { useEffect, useState } from "react";

const VideoPageVideoViewRatePanel = (props) => {
    const { handleOpen } = props;
    const { profile, meeting } = useLoaderData();
    const { enqueueSnackbar } = useSnackbar();
    console.log(meeting.presentors);
    const [socket, setSocket] = useState(null);
    const [pitches, setPitches] = useState(meeting.presentors);

    useEffect(() => {
        const ws = new WebSocket(`ws://127.0.0.1:8008/ws/pitches/${meeting.id}/`);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setSocket(ws);
        };
        
        ws.onmessage = (event) => {
            const pitchId = JSON.parse(event.data).pitch;
            const updatedPitches = pitches.map((pitch) => pitch.id === pitchId ? { ...pitch, open_rate: true } : pitch);
            setPitches(updatedPitches);

            const pitchData = pitches.find((pitch) => pitch.id === pitchId);
            enqueueSnackbar(`Rating is now open for ${pitchData.name}.`, { variant: 'info' });
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setSocket(null);
        };

        return () => {
            ws.close();
        };
        // eslint-disable-next-line 
    }, []);

    return (
        <Paper sx={{ p: 2, height: "calc(100vh - 72px - 48px - 24px)", width: "calc(100vw * 0.25)" }}>
            <Stack spacing={1}>
                {pitches.map((presentor) => (
                    <VideoPageVideoViewRatePanelPresentor key={presentor.id} socket={socket} isMember={presentor.team.members.find((account) => account.id === profile.id) ? true : false} pitch={presentor} isStudent={profile.role === "Student"} handleOpen={handleOpen} />
                ))}
            </Stack>
        </Paper>
    );
}

export default VideoPageVideoViewRatePanel;
