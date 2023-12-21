import { Collapse, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";

const CourseList = (props) => {
    const { open } = props;
    const { courses } = useOutletContext();
    const navigate = useNavigate();

    const handleCourseClick = (course) => {
        localStorage.setItem("course", course.id);
        localStorage.setItem("course_link_name", `${course.name} (${course.section})`);
        const url = `/courses/${course.id}/meetings/in_progress/`;
        navigate(url);
    }

    return (
        <Collapse 
            in={open}
        >
            <List 
                sx={{ 
                    maxHeight: "calc(100vh - (64px * 2) - (48px * 6) - 3px)",
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
                {courses.map((course) => (
                    <ListItem key={course.id} disablePadding>
                        <ListItemButton sx={{ pl: 3 }} onClick={() => handleCourseClick(course)}>
                            <ListItemText
                                primary={`${course.name}`}
                                secondary={`${course.code} - ${course.section}`}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Collapse>
    );
}

export default CourseList;
