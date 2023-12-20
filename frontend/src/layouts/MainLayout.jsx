import { Outlet, useOutletContext } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import { Box, Toolbar } from "@mui/material";
 
export const MainLayout = () => {
    const { profile, courses } = useOutletContext();

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar />
            <Sidebar />
            <Box
                component="main"
                sx={{ flexGrow: 1, width: { sm: `calc(100% - 240px)` }}}
            >
                <Toolbar />
                <Outlet context={{ profile: profile, courses: courses }} />
            </Box>
        </Box>      
    );
}
