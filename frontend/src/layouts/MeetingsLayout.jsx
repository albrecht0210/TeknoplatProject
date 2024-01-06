import { Box, Button, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Await, defer, useLoaderData, useOutletContext } from "react-router-dom";
import { fetchAllCriterias, fetchPitchesByCourse } from "../services/teknoplat_server";
import CreateMeetingDialog from "../features/meeting/CreateMeetingDialog";
import { Suspense,  useState } from "react";

export async function loader({ request, params }) {
    const courseId = params.courseId;
    try {
        const pitchesReponses = fetchPitchesByCourse(courseId);;
    
        const criteriaResponse = fetchAllCriterias();
    
        return defer({ pitches: pitchesReponses, criterias: criteriaResponse });
    } catch (error) {
        return error.response.data;
    }
}

export const Component = () => {
    const { pitches, criterias } = useLoaderData();
    const { profile } = useOutletContext();

    let tabOptions = [
        { value: 0, name: "Pending" },
        { value: 1, name: "In Progress" },
        { value: 2, name: "Completed" }
    ];

    const [statusTabValue, setStatusTabValue] = useState(Number(localStorage.getItem("meetingsPageTabValue")) ?? 1);
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
        setStatusTabValue(value);
    }

    const handleSearchInput = (event) => {
        setSearchMeeting(event.target.value);
    }

    return (
        <Box p={3}>
            <Suspense fallback={<Box></Box>}>
                <Await resolve={profile}>
                    {(resolveProfile) => (
                        <Stack direction="row" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={statusTabValue} onChange={handleTabChange} aria-label="Status Tabs with additional Data">
                                {tabOptions.map((option) => (
                                    <Tab key={option.value} id={`status-option-${option.value}`} label={option.name} aria-controls={`status-tabpanel-${option.value}`} />
                                ))}
                                {resolveProfile.data.role === "Student" && <Tab id={`status-option-3`} label="My Team" aria-controls={`status-tabpanel-3`} />}
                                {resolveProfile.data.role === "Teacher" && <Tab id={`status-option-3`} label="Teams" aria-controls={`status-tabpanel-3`} />}
                            </Tabs> 
                            <Stack direction="row" spacing={2} alignItems="center" ml="auto">
                                {resolveProfile.data.role === "Teacher" && <Button size="small" variant="contained" onClick={handleOpenCreateDialog}>Create</Button>}
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
                        </Stack>
                    )}
                </Await>
            </Suspense>
            
            {/* <Outlet context={{ search: searchMeeting }} /> */}
            {/* <CreateMeetingDialog 
                open={openCreateDialog} 
                pitches={data.pitches}
                teams={data.teams}
                criterias={data.criterias}
                profile={profile}
                handleClose={handleCloseCreateDialog}
            /> */}
        </Box>
    );
}

Component.displayName = "MeetingsLayout";
