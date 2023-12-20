import { AppBar, Toolbar } from "@mui/material";

const AuthNavbar = () => {
    return (
        <AppBar 
            position="fixed"
            sx={{
                width: { sm: "calc(100% - 240px)" },
                ml: { sm: "240px" },
            }}
        >
            <Toolbar sx={{ p: "0px 12px !important" }}>
            </Toolbar>
        </AppBar>
    );
}

export default AuthNavbar;