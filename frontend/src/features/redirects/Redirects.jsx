import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Component = () => {
    const navigate = useNavigate();

    const initLoading = localStorage.getItem("loadingRedirect") ? JSON.parse(localStorage.getItem("loadingRedirect")) : true;
    const [loading, setLoading] = useState(initLoading);

    useEffect(() => {
        console.log(loading);
        if (loading) {
            localStorage.setItem("loadingRedirect", false);
            setLoading(false);
            navigate(0);
        } else {
            localStorage.removeItem("loadingRedirect");
            setTimeout(() => {
                navigate("/");            
            }, 1000);
        }
        // eslint-disable-next-line
    }, []);
    
    return (
        <Box sx={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box>
                <Typography variant="h5" textAlign="center">Leaving meeting...</Typography>
            </Box>
        </Box>
    );
}

Component.displayName = "Redirects";
