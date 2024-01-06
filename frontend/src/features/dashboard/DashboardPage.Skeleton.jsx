import { Box, Button, Paper, Skeleton, Stack, Typography } from "@mui/material";

const DashboardPageSkeleton = () => {
    return (
        <Box p={3}>
            <Stack direction="row" spacing={3} useFlexGap flexWrap="wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                    <Paper
                        key={item}
                        component={Button}
                        sx={{ 
                            height: "calc((100vh - 64px - 50px) * 0.35)", 
                            width: "calc((100vw - 280px) * 0.3)",
                            p: 3
                        }}
                    >
                        <Stack spacing={1} sx={{ width: "100%" }}>
                            <Typography variant="h3"><Skeleton animation="wave" /></Typography>
                            <Typography variant="h5"><Skeleton animation="wave" /></Typography>
                        </Stack>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
}

export default DashboardPageSkeleton;
