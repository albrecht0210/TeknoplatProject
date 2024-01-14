import { Box, Collapse, Paper, Stack } from "@mui/material";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import VideoPageVideoViewParticipantView from "./VideoPage.VideoView.ParticipantView";
import VideoPageVideoViewControls from "./VideoPage.VideoView.Controls";
import VideoPageVideoViewParticipantPanel from "./VideoPage.VideoView.ParticipantPanel";
import VideoPageVideoViewChatPanel from "./VideoPage.VideoView.ChatPanel";
import VideoPageVideoViewRatePanel from "./VideoPage.VideoView.RatePanel";

function VideoPageVideoView() {

    const { join, participants } = useMeeting();
    const [load, setLoad] = useState(true);
    const [collapse, setCollapse] = useState(false);
    const [collapseHidden, setCollapseHidden] = useState(true);
    const [optionTabValue, setOptionTabValue] = useState(-1);

    useEffect(() => {
        if (load) {
            setLoad(false);
        } else {
            join();
        }
        // eslint-disable-next-line
    }, [load]);

    useEffect(() => {
        if (optionTabValue !== -1) {
            setCollapse(true);
            setCollapseHidden(false);
        } else {
            setCollapse(false);
            setCollapseHidden(true);
        }
    }, [optionTabValue]);

    const handleControlTabChange = (index) => {
        setOptionTabValue(index);
    }

    

    return (
        <Box height="100vh" p={3}>
            <Stack height="calc(100vh - 72px - 48px)" direction="row" spacing={2} justifyContent="space-between" sx={{ pb: 3 }}>
                <Box>
                    <Collapse in={collapseHidden} orientation="horizontal" >
                        <Box/>
                    </Collapse>
                </Box>
                <Box>
                    {[...participants.keys()].map((participantId) => (
                        <VideoPageVideoViewParticipantView
                            participantId={participantId}
                            key={participantId}
                        />
                    ))}
                </Box>
                <Box>
                    <Collapse in={collapse} orientation="horizontal" >
                        {optionTabValue === -1 && <Paper sx={{ width: "360px", height: "calc(100vh - 48px - 72px - 24px)" }} />}
                        {optionTabValue === 0 && <VideoPageVideoViewRatePanel />}
                        {optionTabValue === 1 && <VideoPageVideoViewParticipantPanel />}
                        {optionTabValue === 2 && <VideoPageVideoViewChatPanel />}
                    </Collapse>
                </Box>
            </Stack>
            <VideoPageVideoViewControls 
                controlTab={optionTabValue}
                changeTab={handleControlTabChange}
                // rate={{ onRate, handleToggleRate }} 
                // participant={{ onParticipant, handleToggleParticipants }} 
                // chat={{ onVideoChat, handleToggleVideoChat }} 
                // handleToggleCollapse={handleToggleCollapse}
            />
        </Box>
    );
}

export default VideoPageVideoView;
