import { DarkMode, LightMode } from "@mui/icons-material";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ApplicationLinks = () => {
    const navigate = useNavigate();
    
    const mode = localStorage.getItem('theme') ? localStorage.getItem("theme") : "dark";

    const [darkMode, setDarkMode] = useState(mode === "dark" ? true : false);
    
    const handleToggleMode = () => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
        setDarkMode(!darkMode);
    }

    const handleValidationClick = () => {
        navigate("chatbot/");
    }

    return (
        <List>
            <ListSubheader component="div">
                Application
            </ListSubheader>
            <ListItem disablePadding>
                <ListItemButton onClick={handleValidationClick}>
                    <ListItemText primary="Idea Validation" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton onClick={handleToggleMode}>
                    <ListItemIcon>
                        { darkMode ? <LightMode /> : <DarkMode /> }
                    </ListItemIcon>
                    <ListItemText primary={ darkMode ? "Light Mode" : "Dark Mode" } />
                </ListItemButton>
            </ListItem>
        </List>
    );
}

export default ApplicationLinks;
