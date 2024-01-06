import { useEffect, useState } from "react";
import { fetchMeetingsByCourseAndStatus } from "../../services/teknoplat_server";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";



const MeetingsPageTable = (props) => {
    const { search, status } = props;
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [meetings, setMeetings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const getMeetings = async (limit = 5, offset = 0) => {
        try {
            const meetingsResponse = await fetchMeetingsByCourseAndStatus(courseId, status, limit, offset);
            setMeetings(meetingsResponse.data.results);
            setCount(meetingsResponse.data.count);
        } catch (error) {

        }
    }

    useEffect(() => {
        getMeetings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLoading(true);
        getMeetings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    useEffect(() => {
        setLoading(true);
        getMeetings((page + 1) * rowsPerPage, page * rowsPerPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        if (meetings !== null) {
            setLoading(false);
        }
    }, [meetings]);

    const handleChangePage = async (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = async (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const handleMeetingClick = (meeting) => {
        localStorage.setItem("meeting", meeting.id);
        localStorage.setItem("meeting_link_name", meeting.name);
        localStorage.setItem("videoId", meeting.video);
        navigate(`/courses/${courseId}/meetings/${meeting.id}`);
    }

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
                                <TableCell sx={{ opacity: 0.9 }}>Title</TableCell>
                                <TableCell sx={{ width: "calc(100% * 0.2)", opacity: 0.9 }}>Teacher Score Weight</TableCell>
                                <TableCell sx={{ width: "calc(100% * 0.2)", opacity: 0.9 }}>Student Score Weight</TableCell>
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
                                meetings.filter((meeting) => meeting.name.includes(search)).map((meeting) => (
                                    <TableRow key={meeting.id}>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleMeetingClick(meeting)}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                        <TableCell>{ meeting.name }</TableCell>
                                        <TableCell>{ `${meeting.teacher_weight_score * 100}%` }</TableCell>
                                        <TableCell>{ `${meeting.student_weight_score * 100}%` }</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}

export default MeetingsPageTable;
