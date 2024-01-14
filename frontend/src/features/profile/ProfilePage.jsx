import { Box, Stack, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";

export const Component = () => {
    const { profile } = useOutletContext();

    return (
        <Box p={3}>
            <Stack spacing={2}>
                <Typography variant="h2" fontWeight="bold">{profile.full_name}</Typography>
                <Stack direction="row" spacing={1}>
                    <Typography variant="h6" fontWeight="bold">Username:</Typography>
                    <Typography variant="h6" fontWeight="normal">{profile.username}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Typography variant="h6" fontWeight="bold">Email:</Typography>
                    <Typography variant="h6" fontWeight="normal">{profile.email}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Typography variant="h6" fontWeight="bold">Role:</Typography>
                    <Typography variant="h6" fontWeight="normal">{profile.role}</Typography>
                </Stack>
            </Stack>
        </Box>
    );
}

Component.displayName = "ProfilePage";
