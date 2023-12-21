
export async function loader({ request, params }) {
}

export async function action({ request, params }) {
}

function VideoPageVideoViewParticipantPanel() {
    const { profile, course, participants } = useOutletContext();

    const inMeeting = participants.map((participant) => course.members.find((member) => member.id === participant));
    const notInMeeting = course.members.filter((member) => !inMeeting.find((meetingMember) => member.id === meetingMember.id));

    return (
        <Paper sx={{ height: "calc(100vh - 72px - 48px - 24px)", width: "calc(100vw * 0.25)" }}>
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
                {inMeeting.filter((member) => member.role === "Teacher").map((teacher) => (
                    <ListItem 
                        key={teacher.id}
                        disablePadding
                        secondaryAction= {profile.role === "teacher" && (
                            <Stack direction="row" spacing={1}>
                                <IconButton aria-label="toggleMic" onClick={handleToggleParticipantMic}>
                                    {micOn ? <Mic /> : <MicOff />}
                                </IconButton>
                                <IconButton aria-label="toggleVideo" onClick={handleToggleParticipantWebCam}>
                                    {webcamOn ? <Videocam /> : <VideocamOff />}
                                </IconButton>
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
                            <ListItemText primary={teacher.full_name}/>
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Students
                </ListSubheader>
                {inMeeting.filter((member) => member.role === "Student").map((student) => (
                    <ListItem 
                        key={student.id}
                        disablePadding
                        secondaryAction= {profile.role === "teacher" && (
                            <Stack direction="row" spacing={1}>
                                <IconButton aria-label="toggleMic" onClick={handleToggleParticipantMic}>
                                    {micOn ? <Mic /> : <MicOff />}
                                </IconButton>
                                <IconButton aria-label="toggleVideo" onClick={handleToggleParticipantWebCam}>
                                    {webcamOn ? <Videocam /> : <VideocamOff />}
                                </IconButton>
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
                            <ListItemText primary={student.full_name}/>
                        </ListItemButton>
                    </ListItem>
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
