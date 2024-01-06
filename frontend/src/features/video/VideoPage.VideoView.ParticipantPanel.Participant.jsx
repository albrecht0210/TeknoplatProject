import { ListItem, ListItemButton, ListItemText, Stack } from "@mui/material";

function VideoPageVideoViewParticipantPanelParticipant(props) {
    const { participant, isNotHost } = props;
    // const { enableWebcam: remoteEnableWebcam, disableWebcam: remoteDisableWebcam, enableMic, disableMic: remoteDisableMic, webcamOn, micOn } = useParticipant(participant.id);
    // const { enableWebcam: localEnableWebcam, disableWebcam: localDisableWebcam, unmuteMic, muteMic } = useMeeting({
    //     onWebcamRequested: ({ accept, reject, participantId }) => {
    //         // callback function to accept the request
    //         // how to get the webcam option and let user choose
    //         accept();
    //     },
    //     onMicRequested: ({ accept, reject, participantId }) => {
    //         // callback function to accept the request
    //         accept();
    //     },
    // });

    // function handleToggleParticipantWebCam() {
    //     if (webcamOn) {
    //         remoteDisableWebcam();
    //         setTimeout(() => {
    //             localEnableWebcam();
    //         }, 500);
    //     } else {
    //         localDisableWebcam();
    //         setTimeout(() => {
    //             remoteEnableWebcam();
    //         }, 500);
    //     }
    // }

    // const handleToggleParticipantMic = () => {
    //     if (micOn) {
    //         remoteDisableMic();
    //         setTimeout(() => {
    //             unmuteMic();
    //         }, 500);
    //     } else {
    //         muteMic();
    //         setTimeout(() => {
    //             enableMic();
    //         }, 500);
    //     }
    // }

    return (
        <ListItem 
            disablePadding
            secondaryAction= {isNotHost && (
                <Stack direction="row" spacing={1}>
                    {/* <IconButton aria-label="toggleMic" onClick={handleToggleParticipantMic}>
                        {micOn ? <Mic /> : <MicOff />}
                    </IconButton>
                    <IconButton aria-label="toggleVideo" onClick={handleToggleParticipantWebCam}>
                        {webcamOn ? <Videocam /> : <VideocamOff />}
                    </IconButton> */}
                </Stack>
            )}
        >
            <ListItemButton 
                disabled 
                sx={{ 
                    opacity: "1 !important", 
                    userSelect: "text", 
                    cursor: "text !important", 
                    pointerEvents: "auto" 
                }}
            >
                <ListItemText primary={participant.full_name}/>
            </ListItemButton>
        </ListItem>
    );
}

export default VideoPageVideoViewParticipantPanelParticipant;
