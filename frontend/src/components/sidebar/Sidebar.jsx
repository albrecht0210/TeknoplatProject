import { Box, Divider, Drawer } from "@mui/material";
import Logo from "../logo/Logo";
import MainLinks from "./MainLinks";
import ApplicationLinks from "./ApplicationLinks";
import AccountButton from "./AccountButton";

const Sidebar = () => {
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
                <MainLinks />
                <Divider />
                <ApplicationLinks />
                <Divider sx={{ mt: "auto" }} />
                <AccountButton />
            </Drawer>
        </Box>
    );
}

export default Sidebar;
