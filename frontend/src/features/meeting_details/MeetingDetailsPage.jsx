import { Box, Button, Divider, Grid, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Suspense, useEffect, useState } from "react";
import { Await, Form, defer, redirect, useLoaderData, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { fetchMeetingById, fetchMeetingFeedbacks, fetchMeetingOverallRatings, generateVideoId, updateMeetingStatusAndVideoId, validateVideoId } from "../../services/teknoplat_server";
import MeetingDetailsPageSkeleton from "./MeetingDetailsPage.Skeleton";
import MeetingDetailsPageMembers from "./MeetingDetailsPage.Members";
import MeetingDetailsPagePresentors from "./MeetingDetailsPage.Presentors";
import MeetingDetailsPageCriterias from "./MeetingDetailsPage.Criterias";
import MeetingDetailsPageComments from "./MeetingDetailsPage.Comments";
import Cookies from "js-cookie";
import MeetingDetailsPageHistoryDialog from "./MeetingDetailsPage.HistoryDialog";

export async function loader({ request, params }) {
    const courseId = params.courseId;
    const meetingId = params.meetingId;

    try {
        const meetingResponse = fetchMeetingById(meetingId);
        const overallRatingResponse = fetchMeetingOverallRatings(meetingId);
        const feedbacksResponse = fetchMeetingFeedbacks(meetingId);
        return defer({ meeting: meetingResponse, overallRating: overallRatingResponse, feedbacks: feedbacksResponse });
    } catch (error) {
        return redirect(`/courses/${courseId}/meetings/`);
    }
}

export async function action({ request, params }) {
    let formData = await request.formData();
    let intent = formData.get("intent");

    if (intent === "start") {
        try {
            const meetingResponse = await fetchMeetingById(params.meetingId);
            const videoResponse = await generateVideoId(Cookies.get("videoAccessToken"));
            await updateMeetingStatusAndVideoId(meetingResponse.data, videoResponse.data);
            await validateVideoId();
            localStorage.setItem("videoId", videoResponse.data.meetingId);
            return redirect(`/live/${params.meetingId}`);
        } catch (error) {
            console.log(error.response.data);
            return error.response.data;
        }
    }

    if (intent === "join") {
        let video = formData.get("video");
        try {
            await validateVideoId(Cookies.get("videoAccessToken"), video);
            return redirect(`/live/${params.meetingId}`);
        } catch(error) {
            console.log(error.response.data);
            return error.response.data;
        }
    }
}

export const Component = (props) => {
    const { profile, courses } = useOutletContext();
    const { meeting, overallRating, feedbacks } = useLoaderData();
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [meetingDetailsPageTabValue, setDetailsPageTabValue] = useState(Number(localStorage.getItem("meetingsDetailsageTabValue")) ?? 0);
    const [course, setCourse] = useState();
    const [meetingData, setMeetingData] = useState();
    const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
    const [isDoneFetching, setIsDoneFetching] = useState(false);
    
    useEffect(() => {
        const resolveFetch = async () => {
            await Promise.all([courses, meeting]).then((data) => {
                const [courses, meeting] = data;

                const course = courses.data.find((course) => course.id === courseId);
                if (!course) {
                    navigate("/");
                }
                setCourse(course);
                setMeetingData(meeting.data);
            })
            .catch((error) => {
                navigate(`/courses/${courseId}/meetings/`);
            })
            .finally(() => setIsDoneFetching(true));
        }

        resolveFetch();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        
    }, [meetingData]);

    const handleHistoryDialog = async () => {
        setOpenHistoryDialog(true);
    }
    
    const handleHistoryDialogClose = () => {
        setOpenHistoryDialog(false);
    }
    
    const handleTabChange = (event, value) => {
        localStorage.setItem("meetingsDetailsageTabValue", value);
        setDetailsPageTabValue(value);
    }
    
    return (
        <Box p={3}>
            {isDoneFetching ? (
                <Box>
                    <MeetingDetailsPageInner course={course} profile={profile} meeting={meetingData} tabValue={meetingDetailsPageTabValue} tabChange={handleTabChange} dialogOpenChange={handleHistoryDialog} />
                    { meetingData.status.toLowerCase() === "completed" && (
                        <Suspense fallBack={<Box/>}>
                            <Await resolve={Promise.all([overallRating, feedbacks]).then(value => value)}>
                                {openHistoryDialog && <MeetingDetailsPageHistoryDialog open={openHistoryDialog} handleClose={handleHistoryDialogClose} meeting={meetingData} />}
                            </Await>
                        </Suspense>
                    )}
                </Box>
            ) : (
                <MeetingDetailsPageSkeleton />
            )}
        </Box>
    );
}

Component.displayName = "MeetingDetailsPage";

const MeetingDetailsPageInner = (props) => {
    const { course, profile, meeting, tabValue, tabChange, dialogOpenChange } = props;
    const tabOptions = [
        { value: 0, name: "Pitch", stringValue: "pitch" },
        { value: 1, name: "Criteria", stringValue: "criteria" },
        { value: 2, name: "Comments", stringValue: "comments" }
    ];

    return (
        <Grid container spacing={2}>
            <Grid item sm={12} md={8}>
                <Stack spacing={3} sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={5}>
                        <Typography variant="h5">{ meeting.name }</Typography>
                        { meeting.status === "pending" && profile.role === "Teacher" && (
                            <Form method="post">
                                <Button type="submit" name="intent" value="start" variant="contained">Start</Button>
                            </Form>
                        )}
                        { meeting.status === "in_progress" && (
                            <Form method="post">
                                <TextField sx={{ display: "none" }} name="video" value={meeting.video} />
                                <Button type="submit" name="intent" value="join" variant="contained">Join</Button>
                            </Form>
                        )}
                        { meeting.status === "completed" && (
                            <Button variant="contained" onClick={dialogOpenChange}>View</Button>
                        )}
                    </Stack>
                    <Typography fontWeight={100} variant="h6">{ meeting.description }</Typography>
                </Stack>
                <Tabs value={tabValue} onChange={tabChange} aria-label="action-tabs">
                    {tabOptions.map((option) => (
                        <Tab key={option.value} id={`option-${option.value}`} label={option.name} aria-controls={`tabpanel-${option.value}`} />
                    ))}
                </Tabs> 
                <Divider />
                {tabValue === 0 && <MeetingDetailsPagePresentors presentors={meeting.presentors} />}
                {tabValue === 1 && <MeetingDetailsPageCriterias criterias={meeting.criterias} />}
                {tabValue === 2 && <MeetingDetailsPageComments profile={profile} comments={meeting.comments} />}
            </Grid>
            <Grid item sm={12} md={4}>
                <MeetingDetailsPageMembers members={course.members} />
            </Grid>
        </Grid>
    );
}
