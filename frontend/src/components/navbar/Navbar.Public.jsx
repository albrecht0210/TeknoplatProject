import { AppBar, IconButton, Toolbar } from "@mui/material";
import Logo from "../logo/Logo";
import { useContext, useEffect } from "react";
import { DarkMode, LightMode } from "@mui/icons-material";
import { RootThemeContext } from "../../context/RootThemeContext";

const PublicNavbar = () => {
    const { darkMode, setDarkMode } = useContext(RootThemeContext);

    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);
    
    const handleToggleThemeMode = () => {
        setDarkMode(!darkMode);
    }
    
    return (
        <AppBar position="fixed">
            <Toolbar sx={{ mx: { xs: 1, md: 3, lg: 5 } }}>
                <Logo />
                <IconButton sx={{ ml: "auto" }} onClick={handleToggleThemeMode}>
                    { darkMode ? <LightMode /> : <DarkMode /> }
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default PublicNavbar;
