import { Grid, Skeleton, Stack } from "@mui/material";
import { MeetingDetailsPageMembersSkeleton } from "./MeetingDetailsPage.Members";

const MeetingDetailsPageSkeleton = () => {
    return (
        <Grid
            container
            spacing={2}
        >
            <Grid item sm={12} md={8}>
                <Stack spacing={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton animation="wave" variant="text" width={250} height={50} />
                        <Skeleton animation="wave" variant="rounded" width={150} height={30} />
                    </Stack>
                    <Skeleton animation="wave" variant="text" height={200} />
                    <Skeleton animation="wave" variant="rectangular" height={"calc(100vh * .3)"} />
                </Stack>
            </Grid>
            <Grid item sm={12} md={4}>
                <MeetingDetailsPageMembersSkeleton />
            </Grid>
        </Grid>
    );
}

export default MeetingDetailsPageSkeleton;
