import { Button, Paper, Stack, Typography } from "@mui/material";
import { updateOpenPitchRate } from "../../services/teknoplat_server";

const VideoPageVideoViewRatePanelPresentor = (props) => {
    const { socket, pitch, isMember=false, isStudent, handleOpen } = props;

    const handleOpenRateClick = async () => {
        try {
            await updateOpenPitchRate(pitch);
            socket.send(JSON.stringify({
                'pitch': pitch.id
            }));
        } catch (error) {

        }
    }

    const handleRateClick = () => {
        localStorage.setItem("pitch", pitch.id);
        handleOpen();
    }
    
    return (
        <Paper elevation={4} sx={{ p: 1, pl: 2 }} >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography>{pitch.name}</Typography>
                { isMember && <Button disabled>Rate</Button> }
                { (isStudent && !pitch.open_rate && !isMember) && <Button disabled>Rate</Button> }
                { (isStudent && pitch.open_rate && !isMember) && <Button onClick={handleRateClick}>Rate</Button> }
                { (!isStudent && pitch.open_rate && !isMember) && <Button onClick={handleRateClick}>Rate</Button> }
                { (!isStudent && !pitch.open_rate && !isMember) && <Button onClick={handleOpenRateClick}>Open</Button> }
            </Stack>
        </Paper>
    );
}

export default VideoPageVideoViewRatePanelPresentor;
