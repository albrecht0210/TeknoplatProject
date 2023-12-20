import { Box, Button, Divider, Stack, TextField } from "@mui/material";
import { Outlet, useLoaderData } from "react-router-dom";
import TabContainer from "../components/tabcontainer/TabContainer";
import { fetchTeamsByCourse } from "../services/team_server";
import { fetchAllCriterias, fetchPitchByTeam } from "../services/teknoplat_server";
import CreateMeetingDialog from "../features/meeting/CreateMeetingDialog";

export async function loader({ request, params }) {
    const courseId = params.courseId;
    try {
        const teamResponse = await fetchTeamsByCourse(courseId);
        const teams = teamResponse.data;
    
        const pitchesReponses = await Promise.all(teams.map(async (team) => await fetchPitchByTeam(team.id)));
        const pitches = pitchesReponses.map((response) => response.data[0]);
    
        const criteriaResponse = await fetchAllCriterias();
    
        return { pitches: pitches, criterias: criteriaResponse.data };
    } catch (error) {
        return error.response.data;
    }
}

export const MeetingsLayout = () => {
    const data = useLoaderData();
    const { profile } = useOutletContext();

    const tabOptions = [
        { value: 0, name: "Pending", stringValue: "pending" },
        { value: 1, name: "In Progress", stringValue: "in_progress" },
        { value: 2, name: "Completed", stringValue: "completed" }
    ];

    const initTabValue = localStorage.getItem("statusTabValue") ? Number(localStorage.getItem("statusTabValue")) : 1;
    const [statusTabValue, setStatusTabValue] = useState(initTabValue);
    const [searchMeeting, setSearchMeeting] = useState("");
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    }

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    }

    const handleTabChange = (event, value) => {
        const option = tabOptions.find((option) => option.value === value);
        localStorage.setItem("statusTabValue", value);
        setStatusTabValue(value);

        navigate(urlPath[0].concat("meetings/".concat(option.stringValue)));
    }

    const handleSearchInput = (event) => {
        setSearchMeeting(event.target.value);
    }

    return (
        <Box p={3}>
            <Stack direction="row">
                <TabContainer 
                    tabOptions={tabOptions}
                    handleChange={handleTabChange}
                    selected={statusTabValue}
                />
                <Stack direction="row" spacing={2} alignItems="center" ml="auto">
                    {profile.role === "Teacher" && <Button size="small" variant="contained" onClick={handleOpenCreateDialog}>Create</Button>}
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
                <Divider />
            </Stack>
            <Outlet context={{ search: searchMeeting }} />
            <CreateMeetingDialog 
                open={openCreateDialog} 
                pitches={data.pitches}
                teams={data.teams}
                criterias={data.criterias}
                profile={profile}
                handleClose={handleCloseCreateDialog}
            />
        </Box>
    );
}

export default MeetingsLayout;
