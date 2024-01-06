import { Box, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";
import { fetchAccountTeams, fetchTeamsByCourse } from "../../services/team_server";
import { useEffect, useState } from "react";

const MeetingsPageTeam = () => {
    const { profile } = useOutletContext();
    const { courseId } = useParams();

    const [teams, setTeams] = useState(null);
    const [loading, setLoading] = useState(true);

    const getTeams = async () => {
        try {
            if (profile.role === "Teacher") {
                const teamsResponse = await fetchTeamsByCourse(courseId);
                setTeams(teamsResponse.data);
            } else {
                const teamsResponse = await fetchAccountTeams();
                setTeams(teamsResponse.data);
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

    return (
        <Box p={5}>
            <Paper>
                <TableContainer 
                    sx={{ 
                        height: "calc(100vh - 64px - 48px - 49px - 80px - 52px - 1px)",
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
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: "calc(100% * 0.09)", opacity: 0.9 }}></TableCell>
                                <TableCell sx={{ opacity: 0.9 }}>Team Name</TableCell>
                                <TableCell sx={{ width: "calc(100% * 0.2)", opacity: 0.9 }}>Pitch Name</TableCell>
                                <TableCell sx={{ width: "calc(100% * 0.2)", opacity: 0.9 }}>Members</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell>
                                        <Skeleton variant="rounded" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="rounded" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="rounded" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="rounded" />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                teams.map((team) => (
                                    <TableRow key={team.id}>
                                        <TableCell>
                                            {/* <Button
                                                variant="contained"
                                                size="small"
                                            >
                                                A
                                            </Button> */}
                                        </TableCell>
                                        <TableCell>{ team.name }</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default MeetingsPageTeam;
