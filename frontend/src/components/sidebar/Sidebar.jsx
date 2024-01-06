import { Box, Divider, Drawer } from "@mui/material";
import Logo from "../logo/Logo";
import MainLinks, { MainLinksSkeleton } from "./Sidebar.MainLinks";
import ApplicationLinks from "./Sidebar.ApplicationLinks";
import AccountButton from "./Sidebar.AccountButton";
import { Suspense } from "react";
import { Await, Navigate } from "react-router-dom";

const Sidebar = (props) => {
    const { courses } = props;

    return (
        <Box
            component="nav"
            sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
            aria-label="teknoplat links"
        >
            <Drawer
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' }
                }}
                variant="permanent"
            >
                <Logo />
                <Divider />
                <Suspense fallback={<MainLinksSkeleton />}>
                    <Await resolve={courses} errorElement={<Navigate to="/" />}>
                        <MainLinks />
                    </Await>
                </Suspense>
                <Divider />
                <ApplicationLinks />
                <Divider sx={{ mt: "auto" }} />
                <AccountButton />
            </Drawer>
        </Box>
    );
}

export default Sidebar;
