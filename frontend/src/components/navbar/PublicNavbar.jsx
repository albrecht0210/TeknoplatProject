import { AppBar, Box } from "@mui/material";
import Logo from "../logo/Logo";

const PublicNavbar = () => {
    return (
        <AppBar position="fixed">
            <Box sx={{ mx: { xs: 1, md: 3, lg: 5 } }}>
                <Logo />
            </Box>
        </AppBar>
    );
}

export default PublicNavbar;
