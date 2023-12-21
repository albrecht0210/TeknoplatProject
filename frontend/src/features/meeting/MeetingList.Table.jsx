import { Button, Table, TableCell, TableHead, TableRow } from "@mui/material";
import { useParams } from "react-router-dom";

const MeetingListTable = (props) => {
    const { meetings } = props;
    let { courseId } = useParams();

    const handleMeetingClick = (meeting) => {
        const url = `courses/${courseId}/meeting/${meeting.id}/pitches/`;
        localStorage.setItem("meeting", meeting.id);
        localStorage.setItem("meeting_link_name", `${meeting.name}`);
        localStorage.setItem("videoId", meeting.video);
        navigate(url);
    }

    return (
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
                { meetings.map((meeting) => (
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
                )) }
            </TableBody>
        </Table>
    );
}

export default MeetingListTable;
