
function VideoPageVideoView(props) {
    const { meeting } = props;
    const { courses, profile } = useOutletContext();
    const course = courses.find((course) => course.id === localStorage.getItem("course"));

    return (
        <Box height="100vh" p={3}>
            <Stack height="calc(100vh - 72px - 48px)" direction="row" spacing={2} justifyContent="space-between" sx={{ pb: 3 }}>
                <Box />
                <Box>
                    {[...participants.keys()].map((participantId) => (
                        <ParticipantView
                            participantId={participantId}
                            key={participantId}
                        />
                    ))}
                </Box>
                <Collapse in={collapse} orientation="horizontal" >
                    <Outlet context={{ host: meeting.owner, course, participants: [...participants.keys()], course: course, meeting: meeting }} />
                </Collapse>
            </Stack>
            <Controls 
                meeting={meeting}
                rate={{ onRate, handleToggleRate }} 
                participant={{ onParticipant, handleToggleParticipants }} 
                chat={{ onVideoChat, handleToggleVideoChat }} 
                handleToggleCollapse={handleToggleCollapse}
            />
            <RateDialog open={openRateDialog} handleClose={handleDialogClose} meeting={meeting} />
        </Box>
    );
}

export default VideoPageVideoView;
