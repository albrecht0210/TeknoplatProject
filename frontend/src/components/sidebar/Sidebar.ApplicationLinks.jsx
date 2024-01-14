import { DarkMode, LightMode } from "@mui/icons-material";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RootThemeContext } from "../../context/RootThemeContext";

const ApplicationLinks = () => {
    const navigate = useNavigate();
    
    const { darkMode, setDarkMode } = useContext(RootThemeContext);

    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);
    
    const handleToggleThemeMode = () => {
        setDarkMode(!darkMode);
    }

    const handleValidationClick = () => {
        navigate("/idea_validation/");
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
                <ListItemButton onClick={handleToggleThemeMode}>
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
