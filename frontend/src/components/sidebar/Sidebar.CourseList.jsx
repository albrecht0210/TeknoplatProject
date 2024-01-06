import { Collapse, List, ListItem, ListItemButton, ListItemText, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CourseList = (props) => {
    const { open, courses } = props;
    const navigate = useNavigate();

    const handleCourseClick = (course) => {
        localStorage.setItem("course", course.id);
        localStorage.setItem("course_link_name", `${course.name} (${course.section})`);
        navigate(`/courses/${course.id}/meetings/`);
    }

    return (
        <Collapse 
            in={open}
        >
            <List 
                sx={{ 
                    maxHeight: "calc(100vh - (64px * 2) - (48px * 7) - 51px)",
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

export const CourseListSkeleton = () => {
    return (
        <Collapse 
                in={true}
            >
            <List 
                sx={{ 
                    maxHeight: "calc(100vh - (64px * 2) - (48px * 7) - 51px)",
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
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ pl: 3 }} >
                            <ListItemText
                                primary={<Skeleton animation="wave" />}
                                secondary={<Skeleton animation="wave" width="calc(100% / 1.5)" />}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Collapse>
    );
}

export default CourseList;
