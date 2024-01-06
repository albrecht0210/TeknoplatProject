import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { List, ListItem, ListItemButton, ListItemText, ListSubheader } from "@mui/material";
import { useState } from "react";
import { useAsyncValue, useNavigate } from "react-router-dom";
import CourseList, { CourseListSkeleton } from "./Sidebar.CourseList";

const MainLinks = () => {
    const courses = useAsyncValue();
    const navigate = useNavigate();

    const [coursesOpen, setCoursesOpen] = useState(true);

    const handleCoursesOptionClick = () => {
        setCoursesOpen(!coursesOpen);
    }

    const handleDashboardClick = () => {
        navigate("/");
    }

    return (
        <List>
            <ListSubheader component="div">
                Main
            </ListSubheader>
            <ListItem disablePadding>
                <ListItemButton onClick={handleDashboardClick}>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton onClick={handleCoursesOptionClick}>
                    <ListItemText primary="Courses"/>
                    { coursesOpen ? <ExpandLess /> : <ExpandMore /> }
                </ListItemButton>
            </ListItem>
            <CourseList open={coursesOpen} courses={courses.data} />
        </List>
    );
}

export const MainLinksSkeleton = () => {
    return (
        <List>
            <ListSubheader component="div">
                Main
            </ListSubheader>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemText primary="My Pitches" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemText primary="Courses"/>
                    <ExpandLess />
                </ListItemButton>
            </ListItem>
            <CourseListSkeleton />
        </List>
    );
}

export default MainLinks;
