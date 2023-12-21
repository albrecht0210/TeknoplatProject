import { Box, Paper, TableContainer, TablePagination } from "@mui/material";
import { redirect, useLoaderData, useOutletContext, useParams } from "react-router-dom";
import { fetchMeetingsByCourseAndStatus } from "../../services/teknoplat_server";
import { useEffect } from "react";
import MeetingListTable from "./MeetingList.Table";

export async function loader({ request, params }) {
    const status = params.status;
    const courseId = params.courseId;

    if (status.toLowerCase() === "pending") {
        localStorage.setItem("statusTabValue", 0);
    } else if (status.toLowerCase() === "in_progress") {
        localStorage.setItem("statusTabValue", 1);
    } else if (status.toLowerCase() === "completed") {
        localStorage.setItem("statusTabValue", 2);
    } else {
        return redirect(`courses/${courseId}/meetings/in_progress/`);
    }

    try {
        const meetingsResponse = await fetchMeetingsByCourseAndStatus(courseId, status);
        return meetingsResponse.data;
    } catch(error) {
        return error.response.data;
    }
}

export async function action({ request, params }) {
}

export const MeetingList = () => {
    const data = useLoaderData();
    let { courseId, status } = useParams();
    const { search } = useOutletContext();

    const [meetings, setMeetings] = useState(data.results);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const nonStateMeetings = data.results;
        const searchMeetings = nonStateMeetings.filter((meeting) => meeting.name.includes(search));
        setMeetings(searchMeetings);
    }, [search]);

    const handleChangePage = async (event, newPage) => {
        const meetingsResponse = await fetchMeetingsByCourseAndStatus(courseId, status, (newPage + 1) * rowsPerPage, newPage * rowsPerPage);
        setMeetings(meetingsResponse.data.results);
        setPage(newPage);

    };

    const handleChangeRowsPerPage = async (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        const meetingsResponse = await fetchMeetingsByCourseAndStatus(courseId, status, newRowsPerPage);
        setMeetings(meetingsResponse.data.results);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    return (
        <Box p={5}>
            <Paper>
                <TableContainer 
                    sx={{ 
                        height: "calc(100vh - 64px - 48px - 48px - 80px - 52px - 1px)",
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
                    <MeetingListTable meetings={meetings} />
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
