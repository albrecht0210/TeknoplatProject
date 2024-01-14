import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Grid, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";
import { fetchAccountTeams, fetchTeamsByCourse } from "../../services/team_server";
import { Fragment, useEffect, useState } from "react";
import { Edit, ExpandMore } from "@mui/icons-material";
import { fetchPitchesByCourse } from "../../services/teknoplat_server";
import MeetingsPageCreatePitch from "./MeetingsPage.CreatePitch";

const MeetingsPageTeam = () => {
    const { profile } = useOutletContext();
    const { courseId } = useParams();

    const [teams, setTeams] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);

    const getTeams = async () => {
        try {
            if (profile.role === "Teacher") {
                const teamsResponse = await fetchTeamsByCourse(courseId);
                const pitchesResponses = await fetchPitchesByCourse(courseId);
                const modifiedTeams = teamsResponse.data.map((team) => {
                    const pitch = pitchesResponses.data.find((pitch) => pitch.team === team.id);
                    if (pitch) delete pitch.team_json;
                    return {
                        ...team,
                        pitch: pitch ?? null
                    };
                });
                setTeams(modifiedTeams);
            } else {
                const teamsResponse = await fetchAccountTeams();
                const pitchesResponses = await fetchPitchesByCourse(courseId);
                const modifiedTeams = teamsResponse.data.map((team) => {
                    const pitch = pitchesResponses.data.find((pitch) => pitch.team === team.id);
                    if (pitch) delete pitch.team_json;
                    return {
                        ...team,
                        pitch: pitch ?? null
                    };
                });
                setTeams(modifiedTeams);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getTeams();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLoading(true);
        getTeams();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    useEffect(() => {
        if (teams !== null) {
            setLoading(false);
        }
    }, [teams]);

    const handleDialogOpen = () => {
        setOpenDialog(true);
    }

    const handleDialogClose = () => {
        setOpenDialog(false);
    }

    const updateTeam = (pitch) => {
        const newTeamData = teams.map((team) => {
            if (team.id === pitch.team) {
                return {
                    ...team,
                    pitch: pitch
                };
            }
            return team;
        })
        setTeams(newTeamData);
    }

    return (
        <Box p={5}>
            {loading ? [0, 1, 2, 3, 4, 5].map((item) => (
                <Accordion key={item}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={`${item}-content`}
                        id={`${item}-header`}
                    >
                        <Skeleton animation="wave" variant="text" />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Skeleton animation="wave" variant="text" />
                    </AccordionDetails>
                </Accordion>
            )) : teams.map((team) => (
                <Accordion key={team.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={`${team.name}-content`}
                        id={`${team.name}-header`}
                    >
                        <Typography>{`${team.name} ${team.pitch ? `- ${team.pitch.name}` : ""}`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid item md={5} sm={12}>
                                <Stack spacing={2}>
                                    <Typography>{ team.name }</Typography>
                                    <Typography>{ team.description }</Typography>
                                    <Typography>Members: 
                                    {team.members.map((member, index) => (
                                        <span key={member.id}>
                                            <span> </span>{member.full_name}{index !== team.members.length - 1 && <span>,</span>} 
                                        </span>
                                    ))}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item md={1} sm={12}>
                                <Divider orientation="vertical" sx={{ display: { md: "block", sm: "none" } }} />
                                <Divider sx={{ display: { md: "none", sm: "block" } }} />
                            </Grid>
                            <Grid item md={6} sm={12}>
                                {team.pitch ? (
                                    <Stack spacing={2}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography>{ team.pitch.name }</Typography>
                                            {profile.role === "Student" && <IconButton size="small" onClick={handleDialogOpen}><Edit fontSize="inherit" /></IconButton>}
                                        </Stack>
                                        <Typography>{ team.pitch.description }</Typography>              
                                        {profile.role === "Student" && <MeetingsPageCreatePitch key={team.pitch.id} open={openDialog} handleClose={handleDialogClose} team={team} updateTeam={updateTeam} isCreate={false} />}
                                    </Stack>
                                ) : (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        {profile.role === "Teacher" ? (
                                            <Typography>No Pitch</Typography> 
                                        ) : (
                                            <Fragment>
                                                <Button variant="contained" onClick={handleDialogOpen}>Create Pitch</Button>
                                                <MeetingsPageCreatePitch open={openDialog} handleClose={handleDialogClose} team={team} updateTeam={updateTeam} />
                                            </Fragment>
                                        )}
                                    </Box>
                                )}
                                
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}

export default MeetingsPageTeam;
