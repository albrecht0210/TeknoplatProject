import { Toolbar, Typography } from "@mui/material";
import { useContext } from "react";
import { RootThemeContext } from "../../context/RootThemeContext";
import Cookies from "js-cookie";

const Logo = () => {
    const { darkMode } = useContext(RootThemeContext);
    const access = Cookies.get("accessToken");

    return (
        <Toolbar sx={{ p: "0px 12px !important" }}>
            <img 
                src={ darkMode ? "/sample/wildcat0.png" : "/sample/wildcat1.png" }
                alt="WildcatLogo" 
                style={{ width: '3rem', marginRight: "8px" }}
            />
            <Typography 
                variant="h6"
                sx={{
                    mr: 2,
                    display: 'flex',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    textDecoration: 'none',
                    color: darkMode ? "#fecc00" : access ? "#fecc00" : "#fff"
                 }}
            >
                TEKNOPLAT
            </Typography>
        </Toolbar>
    );
}

export default Logo;