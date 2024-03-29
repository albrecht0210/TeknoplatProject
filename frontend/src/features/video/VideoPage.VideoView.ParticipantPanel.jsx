import { useLoaderData } from "react-router-dom";
import VideoPageVideoViewParticipantPanelParticipant from "./VideoPage.VideoView.ParticipantPanel.Participant";
import { useMeeting } from "@videosdk.live/react-sdk";
import { List, ListItem, ListItemButton, ListItemText, ListSubheader, Paper } from "@mui/material";

function VideoPageVideoViewParticipantPanel() {
    const { participants } = useMeeting();
    const {meeting, profile, course} = useLoaderData();

    const inMeeting = [...participants.keys()].map((participant) => course.members.find((member) => member.id === participant));
    const notInMeeting = course.members.filter((member) => !inMeeting.find((meetingMember) => member.id === meetingMember.id));
    
    return (
        <Paper sx={{ height: "calc(100vh - 72px - 48px - 24px)", width: "360px" }}>
            <List 
                sx={{ 
                    py: 0,
                    height: "100%",
                    overflowY: "hidden",
                    ":hover": {
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        "&::-webkit-scrollbar": {
                            width: "6px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: (theme) => theme.palette.primary.main,
                            borderRadius: "2.5px",
                        },
                        "&::-webkit-scrollbar-track": {
                            backgroundColor: (theme) => theme.palette.background.paper,
                        },
                    },
                }}
            >
                <ListSubheader sx={{ backgroundColor: "inherit", position: "relative" }}>
                    Teachers
                </ListSubheader>
                {inMeeting.filter((member) => member.role === "Teacher").map((teacher) => {
                    if (meeting.owner === teacher.id) {
                        return <VideoPageVideoViewParticipantPanelParticipant 
                                    key={teacher.id} 
                                    participant={teacher} 
                                    isNotHost={false} 
                                    isOwner={profile.id === meeting.owner}
                                />
                    } else {
                        return <VideoPageVideoViewParticipantPanelParticipant 
                                    key={teacher.id} 
                                    participant={teacher} 
                                    isNotHost={true} 
                                    isOwner={profile.id === meeting.owner}
                                />
                    }
                })}
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Students
                </ListSubheader>
                {inMeeting.filter((member) => member.role === "Student").map((student) => (
                    <VideoPageVideoViewParticipantPanelParticipant 
                        key={student.id} 
                        participant={student} 
                        isNotHost={true} 
                        isOwner={profile.id === meeting.owner}
                    />
                ))}
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Not In Meeting
                </ListSubheader>
                {notInMeeting.map((member) => (
                    <ListItem 
                        key={member.id}
                        disablePadding
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
                            <ListItemText primary={member.full_name}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default VideoPageVideoViewParticipantPanel;
