import { Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

export const Component = () => {
    return (
        <Outlet />
    );
}

Component.displayName = "RootLayout";

export const ErrorBoundary = () => {
    const navigate = useNavigate();
    const access = Cookies.get("accessToken");

    const handleLoginClick = () => {
        navigate("/login");
    }

    const handleDashboardClick = () => {
        navigate("/");
    }

    return (
        <Box>
            <Navbar />
            <Toolbar />
            <Box m={5}>
                <Typography variant="h3" sx={{ mb: 2 }}>It seems that you are lost.</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1">Redirect to</Typography>
                    { access ?
                        <Button variant="contained" onClick={handleDashboardClick}>Dashboard</Button> :
                        <Button variant="contained" onClick={handleLoginClick}>Login</Button>
                    }
                </Stack>
            </Box>
        </Box>
    );
}

ErrorBoundary.displayName = "ErrorPage";
