import { Skeleton, Stack, Tab, Tabs, TextField } from "@mui/material";

const MeetingsPageSkeleton = (props) => {
    const { tabOptions, tabValue, tabChange } = props;
    return (
        <Stack direction="row" sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={tabChange} aria-label="Status Tabs with additional Data">
                {tabOptions.map((option) => (
                    <Tab key={option.value} id={`status-option-${option.value}`} label={option.name} aria-controls={`status-tabpanel-${option.value}`} />
                ))}
                <Skeleton animation="wave" variant="rounded" />
            </Tabs> 
            <Stack direction="row" spacing={2} alignItems="center" ml="auto">
                <Skeleton animation="wave" variant="rounded" />
                <TextField 
                    id="searchMeetingName"
                    name="searchMeetingName"
                    label="Search Meetings"
                    autoComplete="off"
                    variant="outlined"
                    size="small"
                />
            </Stack>
        </Stack>
    );
}

export default MeetingsPageSkeleton;
