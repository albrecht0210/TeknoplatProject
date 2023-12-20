import { Button, Stack, Toolbar } from "@mui/material";

const AccountButton = () => {
    const { profile } = useOutletContext();

    const stringAvatar = (name) => {
        const nameSplit = name.split(' ');
        return {
            sx: {
                bgcolor: "#f6b422",
                width: 30,
                height: 30,
                fontSize: "1rem",
                fontWeight: "bold",
            },
            children: `${nameSplit[0][0]}${nameSplit[nameSplit.length - 1][0]}`,
        }
    }

    return (
        <Toolbar sx={{ p: "0px 12px !important" }}>
            <Stack
                direction="row"
                spacing={0}
                alignItems="center"
            >
                <Button variant="text" sx={{ width: "175px", justifyContent: "flex-start" }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        {profile.avatar !== null ? (
                            <img 
                                src={profile.avatar}
                                alt="AccountProfile"
                                style={{ width: "30px", height: "30px" }}
                            />
                        ) : (
                            <Avatar {...stringAvatar(profile.full_name)} />
                        )}
                        <Stack spacing={0} width="calc(175px - 54px)">
                            <Typography
                                variant="caption"
                                noWrap={true}
                                textAlign="left"
                            >
                                { profile.full_name }
                            </Typography>
                            <Typography
                                variant="caption"
                                textAlign="left"
                                fontSize={10}
                            >
                                { profile.username }
                            </Typography>
                        </Stack>
                    </Stack>
                </Button>
                <IconButton onClick={handleLogoutClick} aria-label="LogoutUser">
                    <Logout />
                </IconButton>
            </Stack>
        </Toolbar>
    );
}

export default AccountButton;
