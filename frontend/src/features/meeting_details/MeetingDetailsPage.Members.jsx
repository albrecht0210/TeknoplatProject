import { List, ListItem, ListItemButton, ListItemText, ListSubheader, Paper, Skeleton } from "@mui/material";

const MeetingDetailsPageMembers = (props) => {
    const { members } = props;

    return (
        <Paper sx={{ height: "calc(100vh - 64px - 48px)", minHeight: "720px" }}>
            <List>
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Teachers
                </ListSubheader>
                {members
                    .filter((member) => member.role.toLowerCase().includes("teacher"))
                    .map((member) => (
                        <ListItem key={member.id} disablePadding>
                            <ListItemButton>
                                <ListItemText primary={member.full_name}/>
                            </ListItemButton>
                        </ListItem>
                ))}
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Students
                </ListSubheader>
                {members
                    .filter((member) => member.role.toLowerCase().includes("student"))
                    .map((member) => (
                        <ListItem key={member.id} disablePadding>
                            <ListItemButton>
                                <ListItemText primary={member.full_name}/>
                            </ListItemButton>
                        </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export const MeetingDetailsPageMembersSkeleton = () => {
    return (
        <Paper sx={{ height: "calc(100vh - 64px - 48px)" }}>
            <List>
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Teachers
                </ListSubheader>
                {[0, 1, 2, 3, 4, 5].map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemText
                            primary={<Skeleton animation="wave" />}
                        />
                    </ListItem>
                ))}
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Students
                </ListSubheader>
                {[0, 1, 2, 3, 4, 5].map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemText
                            primary={<Skeleton animation="wave" />}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default MeetingDetailsPageMembers;
