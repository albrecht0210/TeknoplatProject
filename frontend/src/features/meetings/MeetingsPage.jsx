import { Box, Button, Stack, Tab, Tabs, TextField } from "@mui/material";
import { Await, Navigate, defer, redirect, useLoaderData, useOutletContext, useParams } from "react-router-dom";
import { Suspense,  useState } from "react";
import { fetchAllCriterias, fetchPitchesByCourse } from "../../services/teknoplat_server";
import MeetingsPageTable from "./MeetingsPage.Table";
// import { fetchTeamsByCourse } from "../../services/team_server";
import MeetingsPageCreateMeeting from "./MeetingsPage.CreateMeeting";
import MeetingsPageTeam from "./MeetingsPage.Team";

export async function loader({ request, params }) {
    const courseId = params.courseId;
    try {
        const pitchesReponses = fetchPitchesByCourse(courseId);
        const criteriaResponse = fetchAllCriterias();

        return defer({ pitches: pitchesReponses, criterias: criteriaResponse });
    } catch (error) {
        return redirect("/");
    }
}

export const Component = () => {
    const { pitches, criterias } = useLoaderData();
    const { profile, courses } = useOutletContext();
    const { courseId } = useParams();

    let tabOptions = [
        { value: 0, name: "Pending", stringValue: "pending" },
        { value: 1, name: "In Progress", stringValue: "in_progress" },
        { value: 2, name: "Completed", stringValue: "completed" }
    ];

    const [meetingsPageTabValue, setMeetingsPageTabValue] = useState(Number(localStorage.getItem("meetingsPageTabValue")) ?? 1);
    const [searchMeeting, setSearchMeeting] = useState("");
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    }

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    }

    const handleTabChange = (event, value) => {
        localStorage.setItem("meetingsPageTabValue", value);
        setMeetingsPageTabValue(value);
    }

    const handleSearchInput = (event) => {
        setSearchMeeting(event.target.value);
    }

    return (
        <Box p={3}>
            <Suspense fallback={<Box />}>
                <Await resolve={courses} errorElement={<Navigate to="/" />}>
                    {(resolveCourses) => (
                        resolveCourses.data.find((course) => course.id === courseId) ? (
                            <Stack direction="row" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={meetingsPageTabValue} onChange={handleTabChange} aria-label="Status Tabs with additional Data">
                                    {tabOptions.map((option) => (
                                        <Tab key={option.value} id={`status-option-${option.value}`} label={option.name} aria-controls={`status-tabpanel-${option.value}`} />
                                    ))}
                                    {profile.role === "Student" && <Tab id={`status-option-3`} label="My Team" aria-controls={`status-tabpanel-3`} />}
                                    {profile.role === "Teacher" && <Tab id={`status-option-3`} label="Teams" aria-controls={`status-tabpanel-3`} />}
                                </Tabs> 
                                <Stack direction="row" spacing={2} alignItems="center" ml="auto">
                                    {profile.role === "Teacher" && <Button size="small" variant="outlined" onClick={handleOpenCreateDialog}>Create</Button>}
                                    <TextField 
                                        id="searchMeetingName"
                                        name="searchMeetingName"
                                        value={searchMeeting}
                                        label="Search Meetings"
                                        onChange={handleSearchInput}
                                        autoComplete="off"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Stack>
                                {profile.role === "Teacher" && (
                                    <Suspense fallback={<Box sx={{ display: "none" }} />}>
                                        <Await resolve={Promise.all([pitches, criterias]).then(value => value)}>
                                            <MeetingsPageCreateMeeting open={openCreateDialog} handleClose={handleCloseCreateDialog} profile={profile} />
                                        </Await>
                                    </Suspense>
                                )}
                            </Stack>
                        ) : <Navigate to="/" />
                    )}
                </Await>
            </Suspense>
            {meetingsPageTabValue === 0 && <MeetingsPageTable search={searchMeeting} status={tabOptions.find((option) => option.value === meetingsPageTabValue).stringValue} />}
            {meetingsPageTabValue === 1 && <MeetingsPageTable search={searchMeeting} status={tabOptions.find((option) => option.value === meetingsPageTabValue).stringValue} />}
            {meetingsPageTabValue === 2 && <MeetingsPageTable search={searchMeeting} status={tabOptions.find((option) => option.value === meetingsPageTabValue).stringValue} />}
            {meetingsPageTabValue === 3 && <MeetingsPageTeam />}
        </Box>
    );
}

Component.displayName = "MeetingsPage";
