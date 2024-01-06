import { AppBar, Toolbar } from "@mui/material";
import { useMatches } from "react-router-dom";

const AuthNavbar = () => {
    const matches = useMatches();
    const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => match.handle.crumb(match.pathname));

    return (
        <AppBar 
            position="fixed"
            sx={{
                width: { sm: "calc(100% - 240px)" },
                ml: { sm: "240px" },
            }}
        >
            <Toolbar sx={{ p: "0px 25px !important" }}>
                {crumbs.map((crumb, index) => (
                    <span key={index}>
                        {crumb}
                    </span>
                ))}
            </Toolbar>
        </AppBar>
    );
}

export default AuthNavbar;