
const MeetingDetailsMembers = () => {
    const { course } = useOutletContext();

    return (
        <Paper sx={{ height: "calc(100vh - 64px - 48px)" }}>
            <List>
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Teachers
                </ListSubheader>
                {course.members
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
                {course.members
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

export default MeetingDetailsMembers;
