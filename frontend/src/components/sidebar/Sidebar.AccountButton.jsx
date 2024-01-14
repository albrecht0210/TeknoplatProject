import { Logout } from "@mui/icons-material";
import { Avatar, Button, IconButton, Skeleton, Stack, Toolbar, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useLoaderData, useNavigate } from "react-router-dom";

const AccountButton = () => {
    const navigate = useNavigate();
    let { profile } = useLoaderData();
    
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

    const handleProfileClick = () => {
        navigate("/profile");
    }

    const handleLogoutClick = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("videoAccessToken");
        localStorage.clear();
        navigate(0);
    }

    return (
        <Toolbar sx={{ p: "0px 12px !important" }}>
            <Stack
                direction="row"
                spacing={0}
                alignItems="center"
            >
                <Button variant="text" sx={{ width: "175px", justifyContent: "flex-start" }} onClick={handleProfileClick}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        {profile.avatar ? (
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
                <IconButton aria-label="LogoutUser" onClick={handleLogoutClick}>
                    <Logout />
                </IconButton>
            </Stack>
        </Toolbar>
    );
}

export const AccountButtonSkeleton = () => {
    return (
        <Button variant="text" sx={{ width: "175px", justifyContent: "flex-start" }}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Skeleton variant="circular" animation="wave" width={30} height={30} />
                <Stack spacing={0} width="calc(175px - 54px)">
                    <Typography component="div" variant="caption">
                        <Skeleton animation="wave" />
                    </Typography>
                    <Typography component="div" variant="caption" fontSize={10} width="calc(100% / 1.5)">
                        <Skeleton animation="wave" />
                    </Typography>
                </Stack>
            </Stack>
        </Button>
    );
}

export default AccountButton;
