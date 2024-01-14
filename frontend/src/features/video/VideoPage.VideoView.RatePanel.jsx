import { Paper, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useLoaderData } from "react-router-dom";
import VideoPageVideoViewRatePanelPresentor from "./VideoPage.VideoView.RatePanel.Presentor";
import { useEffect, useState } from "react";
import VideoPageVideoViewRateDialog from "./VideoPage.VideoView.RateDialog";

const VideoPageVideoViewRatePanel = () => {
    const { profile, meeting } = useLoaderData();
    const { enqueueSnackbar } = useSnackbar();

    const [socket, setSocket] = useState(null);
    const [pitches, setPitches] = useState(meeting.presentors);
    const [openRateDialog, setOpenRateDialog] = useState(false);

    useEffect(() => {
        const ws = new WebSocket(`ws://127.0.0.1:8008/ws/pitches/${meeting.id}/`);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setSocket(ws);
        };
        
        ws.onmessage = (event) => {
            console.log("onmessage");
            console.log(event);
            const pitchId = JSON.parse(event.data).pitch;
            console.log(pitchId);
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

    const handleRateDialogOpen = () => {
        setOpenRateDialog(true);
    }

    const handleRateDialogClose = () => {
        localStorage.removeItem("pitch");
        setOpenRateDialog(false);
    }

    return (
        <Paper sx={{ p: 2, height: "calc(100vh - 72px - 48px - 24px)", width: "360px" }}>
            <Stack spacing={1}>
                {pitches.map((presentor) => (
                    <VideoPageVideoViewRatePanelPresentor 
                        key={presentor.id} 
                        socket={socket} 
                        isMember={presentor.team_json.members.find((account) => account.id === profile.id) ? true : false} 
                        pitch={presentor} 
                        isStudent={profile.role === "Student"} 
                        handleOpen={handleRateDialogOpen} 
                    />
                ))}
            </Stack>
            <VideoPageVideoViewRateDialog open={openRateDialog} handleClose={handleRateDialogClose} />
        </Paper>
    );
}

export default VideoPageVideoViewRatePanel;
