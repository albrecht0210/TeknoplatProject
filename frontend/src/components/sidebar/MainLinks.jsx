import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { List, ListItem, ListItemButton, ListItemText, ListSubheader } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MainLinks = () => {
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
            <CoursesList open={coursesOpen} />
        </List>
    );
}

export default MainLinks;
