import { Form, Outlet, redirect, useLoaderData, useOutletContext, useParams } from "react-router-dom";
import { fetchMeeting, fetchMeetingFeedbacks, fetchMeetingOverallRatings, updateMeetingStatusAndVideoId } from "../services/teknoplat_server";
import { useState } from "react";
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import TabContainer from "../components/tabcontainer/TabContainer";
import MeetingDetailsMembers from "../features/meeting/MeetingDetails.Members";

export async function loader({ request, params }) {
    const status = localStorage.getItem("statusTabValue");
    const meetingId = params.meetingId;
    const courseId = params.courseId;
    const url = request.url;

    if (url.includes('/pitches')) {
        localStorage.setItem("meetingTabValue", 0);
    } else if (url.includes('/criterias')) {
        localStorage.setItem("meetingTabValue", 1);
    } else if (url.include('/comments')) {
        localStorage.setItem("meetingTabValue", 2);
    } else {
        return redirect(`courses/${courseId}/meeting/${meetingId}/pitches/`);
    }

    try {
        const meetingResponse = await fetchMeeting(meetingId);
        if (status === 2) {
            const overallRatingResponse = await fetchMeetingOverallRatings(meetingId);
            const feedbacksResponse = await fetchMeetingFeedbacks(meetingId);
            return {
                meeting: meetingResponse.data,
                overallRating: overallRatingResponse.data,
                feedbacks: feedbacksResponse.data
            };
        }
        return { meeting: meetingResponse.data };
    } catch (error) {
        return redirect(`courses/${courseId}/meetings/in_progress/`);
    }
}

export async function action({ request, params }) {
    let formData = await request.formData();
    let intent = formData.get("intent");

    if (intent === "start") {
        try {
            const meetingResponse = await fetchMeeting();
            const videoResponse = await createVideoID();
            await updateMeetingStatusAndVideoId(meetingResponse.data, videoResponse.data);
            await validateVideoID();
            localStorage.setItem("videoId", videoResponse.data.meetingId);
            return redirect(`/live/${params.meetingId}`);
        } catch (error) {
            console.log(error.response.data);
            return error.response.data;
        }
    }

    if (intent === "join") {
        try {
            await validateVideoID();
            return redirect(`/live/${params.meetingId}`);
        } catch(error) {
            console.log(error.response.data);
            return error.response.data;
        }
    }
}

const MeetingLayout = () => {
    const status = localStorage.getItem("statusTabValue");
    const data = useLoaderData();
    const { courseId, meetingId } = useParams();
    const { profile } = useOutletContext();

    const tabOptions = [
        { value: 0, name: "Pitch", stringValue: "pitch" },
        { value: 1, name: "Criteria", stringValue: "criteria" },
        { value: 2, name: "Comments", stringValue: "comments" }
    ];

    const initTabValue = localStorage.getItem("meetingTabValue") ? Number(localStorage.getItem("meetingTabValue")) : 0;
    const [meetingTabValue, setMeetingTabValue] = useState(initTabValue);
    const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
    
    const handleOpenHistoryView = async () => {
        setOpenHistoryDialog(true);
    }

    const handleHistoryDialogClose = () => {
        setOpenHistoryDialog(false);
    }

    const handleTabChange = (event, value) => {
        const option = tabOptions.find((option) => option.value === value);
        localStorage.setItem("meetingTabValue", value);
        setMeetingTabValue(value);
        const url = `courses/${courseId}/meeting/${meetingId}/${option.stringValue}/`;
        navigate(url);
    }

    return (
        <Box>
            <Grid
                container
                spacing={2}
            >
                <Grid item sm={12} md={8}>
                    <Stack spacing={3} sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={5}>
                            <Typography variant="h5">{ data.meeting.name }</Typography>
                            { status === 0 && profile.role === "Teacher" && (
                                <Form method="post">
                                    <Button type="submit" name="intent" value="start" variant="contained">Start</Button>
                                </Form>
                            )}
                            { status === 1 && (
                                <Form method="post">
                                    <Button type="submit" name="intent" value="join" variant="contained">Join</Button>
                                </Form>
                            )}
                            { status === 2 && (
                                <Button variant="contained" onClick={handleOpenHistoryView}>View</Button>
                            )}
                        </Stack>
                        <Typography fontWeight={100} variant="h6">{ data.meeting.description }</Typography>
                    </Stack>
                    <Stack direction="row">
                        <TabContainer 
                            tabOptions={tabOptions}
                            handleChange={handleTabChange}
                            selected={meetingTabValue}
                        />
                        <Divider />
                    </Stack>
                    <Outlet context={{ profile: profile, presentors: data.meeting.presentors, criterias: data.meeting.criterias, comments: data.meeting.comments }} />
                </Grid>
                <Grid item sm={12} md={4}>
                    <MeetingDetailsMembers />
                </Grid>
            </Grid>
            {status === 2 && (
                <HistoryDialog 
                    open={openHistoryDialog} 
                    handleClose={handleHistoryDialogClose}
                    meeting={data.meeting}
                    pitches={data.pitches}
                    feedbacks={data.feedbacks}
                />
            )}
        </Box>
    );
}

export default MeetingLayout;
