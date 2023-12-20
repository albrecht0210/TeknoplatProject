import { Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/navbar/PublicNavbar";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const ErrorPage = () => {
    const [access, setAccess] = useState(Cookies.get("accessToken"));

    const navigate = useNavigate();

    useEffect(() => {
        setAccess(Cookies.get("accessToken"));
    }, []);

    const handleLoginClick = () => {
        navigate("/login");
    }

    const handleDashboardClick = () => {
        navigate("/");
    }

    return (
        <Box>
            <PublicNavbar />
            <Toolbar />
            <Box m={5}>
                <Typography variant="h3" sx={{ mb: 2 }}>It seems that you are lost.</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1">Redirect to</Typography>
                    { access && <Button variant="contained" onClick={handleDashboardClick}>Dashboard</Button>}
                    { !access && <Button variant="contained" onClick={handleLoginClick}>Login</Button>}
                </Stack>
            </Box>
        </Box>
    );
}

export default ErrorPage;